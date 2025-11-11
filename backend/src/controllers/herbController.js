import mongoose from 'mongoose';
import Herb from "../models/Herb.js";

// GET /api/herbs - Get all herbs (simplified for cards)
export const getAllHerbs = async (req, res) => {
  try {
    console.log('getAllHerbs: Starting request...');

    // Check if we're connected to the right database
    const dbName = mongoose.connection.db.databaseName;
    console.log('Current database:', dbName);

    // Get the model name and collection
    const modelName = Herb.modelName;
    const collectionName = Herb.collection.name;
    console.log('Model name:', modelName);
    console.log('Collection name:', collectionName);

    // First try to count documents
    const count = await Herb.countDocuments();
    console.log('Total number of herbs:', count);

    // Try to get all documents and map them to the required format for cards
    const herbs = await Herb.find({}).lean().exec();

    // Map the documents to the required format
    const mappedHerbs = herbs.map(herb => ({
      id: herb._id,
      name: herb.Herb_Name,
      imageUrl: herb['Image-url'] || herb.Image_URL || '',
      scientificName: herb.Scientific_Name,
      introduction: herb.Introduction,
      slug: herb.slug || (herb.Herb_Name ? herb.Herb_Name.toLowerCase().replace(/\s+/g, '-') : undefined)
    }));

    console.log('Mapped herbs:', JSON.stringify(mappedHerbs, null, 2));

    res.json({
      success: true,
      data: mappedHerbs,
      debug: {
        database: dbName,
        collection: collectionName,
        documentCount: count
      }
    });
  } catch (err) {
    console.error('Error in getAllHerbs:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};// GET /api/herbs/:id - Get single herb by ID
export const getHerbById = async (req, res) => {
  try {
    console.log('getHerbById: Looking for herb with id:', req.params.id);

    const herb = await Herb.findById(req.params.id).lean().exec();

    if (!herb) {
      console.log('getHerbById: No herb found with id:', req.params.id);
      return res.status(404).json({
        success: false,
        message: "Herb not found"
      });
    }

    // Map the document to the required format
    const mappedHerb = {
      id: herb._id,
      name: herb.Herb_Name,
      scientificName: herb.Scientific_Name,
      imageUrl: herb.Image_URL,
      shortDescription: herb.Short_Description,
      uses: herb.Uses,
      benefits: herb.Benefits,
      precautions: herb.Precautions,
      dosage: herb.Dosage,
      Seasonal_Usage: herb.Seasonal_usage,
      availability: herb.Availability,
      Active_Pharmaceutical_Ingredient: herb.Active_Pharmaceutical_Ingredient,
      slug: herb.slug || (herb.Herb_Name ? herb.Herb_Name.toLowerCase().replace(/\s+/g, '-') : undefined)
    };

    console.log('getHerbById: Found and mapped herb:', JSON.stringify(mappedHerb, null, 2));

    res.json({
      success: true,
      data: mappedHerb
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid herb ID"
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

// GET /api/herbs/slug/:slug - Get single herb by slug
export const getHerbBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const herb = await Herb.findOne({ slug }).lean().exec();
    if (!herb) {
      return res.status(404).json({
        success: false,
        message: "Herb not found"
      });
    }
    const mappedHerb = {
      id: herb._id,
      name: herb.Herb_Name,
      Common_Names: herb.Common_Names,
      Scientific_Name: herb.Scientific_Name,
      Introduction: herb.Introduction,
      Background_and_Traditional_Use: herb.Background_and_Traditional_Use,
      Active_Constituents: herb.Active_Constituents,
      Mechanism_of_Action: herb.Mechanism_of_Action,
      Health_Benefits: herb.Health_Benefits,
      Safety_and_Side_Effects: herb.Safety_and_Side_Effects,
      Toxicity: herb.Toxicity,
      Warnings_and_Contraindications: herb.Warnings_and_Contraindications,
      Drug_Interactions: herb.Drug_Interactions,
      Seasonal_Usage: herb.Seasonal_Usage || herb.Seasonal_usage || herb.seasonal_usage,
      Recommended_Dosage: herb.Recommended_Dosage,
      References: herb.References,
      imageUrl: herb['Image-url'] || herb.Image_URL || '',
      Active_Pharmaceutical_Ingredient: herb.Active_Pharmaceutical_Ingredient,
      slug: herb.slug || (herb.Herb_Name ? herb.Herb_Name.toLowerCase().replace(/\s+/g, '-') : undefined)
    };
    res.json({
      success: true,
      data: mappedHerb
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// POST /api/herbs - Create a new herb
export const createHerb = async (req, res) => {
  try {
    const {
      Herb_Name,
      Common_Names,
      Scientific_Name,
      Introduction,
      Background_and_Traditional_Use,
      Active_Constituents,
      Mechanism_of_Action,
      Health_Benefits,
      Safety_and_Side_Effects,
      Toxicity,
      Warnings_and_Contraindications,
      Drug_Interactions,
      Recommended_Dosage,
      References,
      Active_Pharmaceutical_Ingredient
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'Herb_Name',
      'Common_Names',
      'Scientific_Name',
      'Introduction',
      'Background_and_Traditional_Use',
      'Active_Constituents',
      'Mechanism_of_Action',
      'Health_Benefits',
      'Safety_and_Side_Effects',
      'Toxicity',
      'Warnings_and_Contraindications',
      'Drug_Interactions',
      'Recommended_Dosage',
      'References',
      'Active_Pharmaceutical_Ingredient'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const herb = await Herb.create({
      Herb_Name,
      Common_Names,
      Scientific_Name,
      Introduction,
      Background_and_Traditional_Use,
      Active_Constituents,
      Mechanism_of_Action,
      Health_Benefits,
      Safety_and_Side_Effects,
      Toxicity,
      Warnings_and_Contraindications,
      Drug_Interactions,
      Recommended_Dosage,
      References,
      Active_Pharmaceutical_Ingredient
    });

    res.status(201).json({
      success: true,
      data: herb
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A herb with this name already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// PUT /api/herbs/:id - Update a herb
export const updateHerb = async (req, res) => {
  try {
    const updateFields = [
      'Herb_Name',
      'Common_Names',
      'Scientific_Name',
      'Introduction',
      'Background_and_Traditional_Use',
      'Active_Constituents',
      'Mechanism_of_Action',
      'Health_Benefits',
      'Safety_and_Side_Effects',
      'Toxicity',
      'Warnings_and_Contraindications',
      'Drug_Interactions',
      'Recommended_Dosage',
      'References',
      'Active_Pharmaceutical_Ingredient'
    ].reduce((acc, field) => {
      if (req.body[field] !== undefined) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    const updatedHerb = await Herb.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedHerb) {
      return res.status(404).json({
        success: false,
        message: "Herb not found"
      });
    }

    res.json({
      success: true,
      data: updatedHerb
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid herb ID"
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// DELETE /api/herbs/:id - Delete a herb
export const deleteHerb = async (req, res) => {
  try {
    const herb = await Herb.findByIdAndDelete(req.params.id);

    if (!herb) {
      return res.status(404).json({
        success: false,
        message: "Herb not found"
      });
    }

    res.json({
      success: true,
      message: "Herb deleted successfully"
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid herb ID"
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
