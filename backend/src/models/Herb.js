import mongoose from "mongoose";

const healthBenefitSchema = new mongoose.Schema({
  Benefit_Name: {
    type: String,
    required: [true, 'Benefit name is required']
  },
  Evidence_Summary: {
    type: String,
    required: [true, 'Evidence summary is required']
  },
  Evidence_Rating: {
    type: String,
    required: [true, 'Evidence rating is required']
  }
});

const apiSchema = new mongoose.Schema({
  Name: String,
  Chemical_Formula: String,
  IUPAC_Name: String,
  Molecular_Weight: String,
  Chemical_Classification: String,
  Molecular_Structure_Image: String
});

const herbSchema = new mongoose.Schema({
  Herb_Name: {
    type: String,
    required: [true, 'Herb name is required'],
    unique: true
  },
  Common_Names: {
    type: [String],
    required: [true, 'Common names are required']
  },
  Scientific_Name: {
    type: String,
    required: [true, 'Scientific name is required']
  },
  Introduction: {
    type: String,
    required: [true, 'Introduction is required']
  },
  Background_and_Traditional_Use: {
    type: String,
    required: [true, 'Background and traditional use is required']
  },
  Active_Constituents: {
    type: String,
    required: [true, 'Active constituents are required']
  },
  Mechanism_of_Action: {
    type: String,
    required: [true, 'Mechanism of action is required']
  },
  Health_Benefits: {
    type: [healthBenefitSchema],
    required: [true, 'Health benefits are required']
  },
  Safety_and_Side_Effects: {
    type: String,
    required: [true, 'Safety and side effects information is required']
  },
  Toxicity: {
    type: String,
    required: [true, 'Toxicity information is required']
  },
  Warnings_and_Contraindications: {
    type: String,
    required: [true, 'Warnings and contraindications are required']
  },
  Drug_Interactions: {
    type: String,
    required: [true, 'Drug interactions information is required']
  },
  Recommended_Dosage: {
    type: String,
    required: [true, 'Recommended dosage is required']
  },
  Seasonal_usage: {
    type: String,
    required: [true, 'Seasonal usage is required']
  },
  References: {
    type: String,
    required: [true, 'References are required']
  },
  Active_Pharmaceutical_Ingredient: {
    type: apiSchema,
    required: [true, 'Active pharmaceutical ingredient information is required']
  },
  "Image-url": {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export default mongoose.model("Herb", herbSchema);
