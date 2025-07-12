const Blog = require("../models/Blog.js");
const BlogTag = require('../models/BlogTag.js');
const BlogCat = require('../models/BlogCat.js');
// const generateSitemap = require('../Traits/Sitemap.js');
const multer = require("multer");
const { Sequelize } = require('sequelize');
const schedule = require("node-schedule");
const path = require("path");
const Tag = require("../models/Tag.js");

// consts torage =BlogStorage;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/blogs'); // Save images in blogs folder
    } else if (file.fieldname === 'email') {
      cb(null, 'uploads/temp'); // Save Excel files in temporary storage
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024,
    fieldSize: 20 * 1024 * 1024
   }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const isImage = /jpeg|jpg|png/.test(file.mimetype);
    // const isExcelFile = file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    // const isCSVFile = file.mimetype === "text/csv";
    // if ((file.fieldname === "image" && isImage) || (file.fieldname === "email" && (isExcelFile || isCSVFile))) {
    //   cb(null, true);
    // } else {
    //   cb(new Error("Only images (JPEG, JPG, PNG) and Excel files (XLSX) are allowed"));
    // }
    if ((file.fieldname === "image" && isImage)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) and Excel files (XLSX) are allowed"));
    }
    
  },
}).fields([
  { name: "image", maxCount: 1 }, // For the blog image
  // { name: "email", maxCount: 1 }, // For the Excel file with emails
]);

const uploadImageToServer = (file) => {
  return new Promise((resolve, reject) => {
    upload(file, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // Returns the URL of the uploaded image
      }
    });
  });
};
// Create a new blog
 const createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        // File size exceeded: send 500 error
        return res.status(500).json({ message: "File size exceeds 5MB limit" });
      }
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }
    
    let { name,url, description,categoryId,emails,tags, focus_keys,alt_text,caption_img,meta_desc,meta_title,can_url,status,schedule_time,excerpt } = req.body;
    const { files } = req;
    const image = files?.image[0];
    

    if (!name || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(status!=="schedule"){
      schedule_time='';
    }
    if(!url ){
      url='/blog/'+name;
    }
      // Validate and process emails
      let focuskeyString = "";
      if (focus_keys) {
        const focuskeyArray = Array.isArray(focus_keys)
          ? focus_keys
          : focus_keys.split(",").map((focus_key) => focus_key.trim());
          focuskeyString = focuskeyArray.join(",");
        }
      
      let emailString = "";
      let excelFile;

      if (emails) {
        const emailArray = Array.isArray(emails)
          ? emails
          : emails.split(",").map((email) => email.trim());
        
        // Validate email format
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const invalidEmails = emailArray.filter((email) => !isValidEmail(email));
  
        if (invalidEmails.length > 0) {
          return res.status(400).json({ message: `Invalid emails: ${invalidEmails.join(", ")}` });
        }
  
        emailString = emailArray.join(","); // Save as comma-separated string
      }
      // const email = await extractEmailsFromExcel(excelFile.path);
      // if(files.email){
      //  excelFile = files?.email[0];
    
      // const excelBuffer = fs.readFileSync(excelFile?.path);
      // const excelBuffer = excelFile?.path;
      // const { validEmails, invalidEmails } = extractEmailsFromExcel(excelBuffer);

      
      // if (validEmails.length === 0) {
      //   return res.status(400).json({ message: "No valid emails found in the Excel file." });
      // }
      //  emailString = validEmails.join(',');
             
//  // Send email notifications to each email in the list

    // }
    try {
      let uniqueUrl = url;
      let suffix = 1; // Start suffix from 1

      // Check for existing URLs and generate a new one if necessary
      while (await Blog.findOne({ where: { url: uniqueUrl } })) {
        uniqueUrl = `${url}-${suffix}`;
        suffix++;
      }
     
      const blog = await Blog.create({
        name,
        url: uniqueUrl,
        categoryId,
        description,
        imagePath: image?.path || "",
        emails: emailString,
        focus_key: focuskeyString,
        alt_text,
        caption_img,
        meta_desc,
        meta_title,
        can_url,
        status,
        schedule_time,
        excerpt,
      });
 console.log("tags1 ",tags);
 if(tags){
   const tagItems = (Array.isArray(tags) ? tags : tags.split(','))
                 .map((t) => t.trim())
                 .filter(Boolean);          // remove blanks

  // 2️⃣ separate numeric IDs from names
  const numericIds = tagItems
    .filter((t) => /^\d+$/.test(t))
    .map(Number);                        // ["12"] → [12]

  const nameStrings = tagItems.filter((t) => !/^\d+$/.test(t));

  const idTags = numericIds.length
    ? await Tag.findAll({ where: { id: numericIds } })
    : [];

  const nameTags = await Promise.all(
    nameStrings.map(async (name) => {
      // optional: store lower-case unique key
      const [tag] = await Tag.findOrCreate({
        where: { name: name.toLowerCase() },
        defaults: { name }
      });
      return tag;
    })
  );

  const allTags = [...idTags, ...nameTags];

  
  await BlogTag.bulkCreate(
    allTags.map((tag) => ({
      blogId: blog.id,
      tagId:  tag.id
    })),
    { ignoreDuplicates: true }   // <- avoids duplicate-key crashes
  );

    }
      const postId=blog._id;
      if(status==="schedule"){
       if (!schedule_time || isNaN(new Date(schedule_time).getTime())) {
    throw new Error("Invalid schedule time provided.");
  }
  try {
    // Schedule the post
    await schedulePost(postId, schedule_time); // Assuming schedulePost returns a Promise
  } catch (error) {
    console.error("Error scheduling the post:", error.message);
  }
      }

    //   await generateSitemap();
      res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving blog "+ error.message });
    }
  });
};

 const getRelatedBlogs = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch related blogs excluding the current blog
    const blogs = await Blog.find({ _id: { $ne: id } ,
    status: "publish"}) // Use id from params
      .populate('categoryId', 'name')
      .limit(5);

    // Fetch additional details for each blog
    const blogsWithDetails = await Promise.all(
      blogs.map(async (blog) => {
        const correctImagePath = blog.imagePath.replace(/\\+/g, '/');

        return {
          ...blog.toObject(),
          imagePath: `${correctImagePath}`,
        };
      })
    );

    // Internal Linking Strategies and Related Posts
    const strategies = blogsWithDetails.map((blog) => ({
      id: blog._id,
      title: blog.name,
      url: `/blog-detail/${blog.url}`,
      imagePath: blog.imagePath,
      excerpt: blog.excerpt,
    }));

    res.status(200).json({
      blogs: blogsWithDetails,
      strategies: {
        internalLinkingSuggestions: strategies.slice(0, 3), // Suggest first 3 for internal linking
        relatedPosts: strategies.slice(3), // Suggest the rest as related posts
      },
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error); // Log the error for better visibility
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};

const schedulePost = (postId, scheduleTime) => {
  schedule.scheduleJob(new Date(scheduleTime), async () => {
    try {
      const updatedPost = await Blog.update(
        { status: 'published' },
        { where: { id: postId }, returning: true, plain: true }
      );

      if (updatedPost[1]) {
        console.log(`Post with ID ${postId} successfully published.`);
      } else {
        console.log(`Post with ID ${postId} not found or already published.`);
      }
    } catch (error) {
      console.error(`Error publishing post with ID ${postId}:`, error.message);
    }
  });
};

 const getAllBlogsUrl = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { status: "publish" },
      attributes: ['url'] // Select only the 'url' field
    });
    res.status(200).json({ blogs:blogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs "+error.message });
  }
};

 const getAllBlogs = async (req, res) => {
  const { page = 1,limit=10} = req.query; 
  const pageSize = Math.max(1, parseInt(limit, 10) || 10); // Default to 10 if invalid

  try {
    const skip = (page - 1) * limit;
    const blogs = await Blog.findAll({
      where: {
        status: "publish"
      },
      include: [
        {
          model: BlogCat,
          as: 'category', 
          attributes: ['name'],  // Include only the 'name' of the category
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
      offset: skip, // Skip for pagination
      limit:pageSize
    });
    
    const totalBlogs = await Blog.count({
      where: {
        status: "publish"
      }
    });
    const totalPages = Math.ceil(totalBlogs / limit); 
    
    const blogsWithDetails = await Promise.all(
      blogs.map(async (blog) => {
        const correctImagePath = process.env.url+"/"+ blog.imagePath.replace(/\\+/g, '/');

        return {
          ...blog.toJSON(),
          imagePath: `${correctImagePath}`
        };
      })
    );
    
    res.status(200).json({ blogs:blogsWithDetails, pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalBlogs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
  }, });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs "+error.message });
  }
};


 const getAllBlogsBack = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: BlogCat,
          as: 'category', // Assuming you have set up an alias for the association
          attributes: ['name'], // Only fetch the 'name' attribute
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
    });
    
    const blogsWithDetails = await Promise.all(
      blogs.map(async (blog) => {
        const correctImagePath = process.env.url+"/"+blog.imagePath.replace(/\\+/g, '/');
    
        // Fetch associated tags using BlogTag bridge
        // const blogTags = await BlogTag.findAll({
        //   where: { blogId: blog.id },
        //   include: [
        //     {
        //       model: Tag,
        //       as: 'tags',
        //       attributes: ['name'], // Only fetch the 'name' attribute
        //     },
        //   ],
        // });
    
        // const tags = blogTags.map((bt) => bt.tag);
    
        return {
          ...blog.toJSON(),
          imagePath: `${correctImagePath}`,
        //   tags,  // Include tags in the response
        };
      })
    );
    
    res.status(200).json({ blogs:blogsWithDetails});
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs "+error.message });
  }
};
// Get a single blog by ID
 const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blogs = await Blog.findOne({
      where: { url: id },  // Use 'where' to search by the URL
      include: [
        {
          model: BlogCat,
          as: 'category', 
          attributes: ['name'],  // Only include the 'name' of the category
        },
      ],
    });
    if (!blogs) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Correct the image path
    const correctImagePath = blogs.imagePath ? process.env.url+"/"+blogs.imagePath.replace(/\\+/g, '/') : `${process.env.url}/upload/thumbnail.jpeg`;
    // const blogTags = await BlogTag.findAll({
    //   where: { blogId: blogs.id },
    //   include: [
    //     {
    //       model: Tag,
    //       as: 'tags',
    //       attributes: ['name'], // Only fetch the 'name' attribute
    //     },
    //   ],
    // });
    // const tags = blogTags
    // .map((bt) => bt.tags) // Map to get associated tags
    // .filter((tag) => tag); 
    
    const blogWithDetails = {
      ...blogs.toJSON(),
      imagePath: correctImagePath,
    //   tags,  // Include tags in the response
    };
    res.status(200).json({ blog: blogWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog "+error.message  });
  }
};

// Update blog information by ID
 const updateBlog = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    let { name,url, description,emails,categoryId,focus_keys,alt_text,caption_img,meta_desc,meta_title,can_url,status,schedule_time,excerpt } = req.body;
    const { files } = req;
    
    let imagePath = '';
    if (files && files.image && files.image[0]) {
      const image = files.image[0];
      imagePath = image.path;
    }
    // let emailString = '';
    // let excelFile = '';
  //   if (files && files.email && files.email[0]) {
  //    excelFile = files.email[0];
  //   const excelBuffer = fs.readFileSync(excelFile.path);
  //   const { validEmails, invalidEmails } = extractEmailsFromExcel(excelBuffer);
  //   if (validEmails.length === 0) {
  //     return res.status(400).json({ message: "No valid emails found in the Excel file." });
  //   }
    
  //   emailString = validEmails.join(',');
  // }  
  let uniqueUrl = url;  // Initialize uniqueUrl with the original URL value
  let suffix = 1; 
  while (await Blog.findOne({ where: { url: uniqueUrl, id: { [Sequelize.Op.ne]: id } } })) {
    uniqueUrl = `${url}-${suffix}`;
    suffix++;
  }
    const updateData = {};
    if (name) updateData.name = name;
    if(!url ){
      updateData.url=name;
    }else{
      updateData.url = uniqueUrl;
    }
    if (description) {
      updateData.description = description;
    }
    // if (description) updateData.description = description;
    if (imagePath) updateData.imagePath = imagePath;
    if (categoryId) updateData.categoryId = categoryId;
    if(status!=="schedule"){
      schedule_time='';
    }
    let focuskeyString = "";
    if (focus_keys) {
      const focuskeyArray = Array.isArray(focus_keys)
        ? focus_keys
        : focus_keys.split(",").map((focus_key) => focus_key.trim());
        focuskeyString = focuskeyArray.join(",");
      }
    let emailsString = "";
    if (emails) {
      const emailsArray = Array.isArray(emails)
        ? emails
        : emails.split(",").map((email) => email.trim());
        emailsString = emailsArray.join(",");
      }
    
    if (emailsString) updateData.emails = emailsString;
    if (focus_keys) updateData.focus_keys = focuskeyString;
    if (meta_desc) updateData.meta_desc = meta_desc;
    if (caption_img) updateData.caption_img = caption_img;
    if (alt_text) updateData.alt_text = alt_text;
    if (meta_title) updateData.meta_title = meta_title;
    if (can_url) updateData.can_url = can_url;
    if (excerpt) updateData.excerpt = excerpt;
    if (status) updateData.status = status;

      
    try {
      // Update blog details
      const [updatedRowCount, updatedBlog] = await Blog.update(updateData, {
        where: { id },
        returning: true, // Get the updated row data
      });
      if (updatedRowCount === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

    //   await generateSitemap();
    //   if(excelFile){
    //   fs.unlinkSync(excelFile.path);
    // }
      res.status(200).json({ message: "Blog updated successfully", updatedBlog });    
    } catch (error) {
      res.status(500).json({ message: "Error updating blog"+ error.message });
    }
  });
};

// Delete a blog by ID
 const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the blog by ID
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    await blog.destroy();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getAllBlogsBack,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getAllBlogsUrl,
};