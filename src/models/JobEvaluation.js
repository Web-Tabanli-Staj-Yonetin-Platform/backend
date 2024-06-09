const mongoose = require('mongoose');

const jobEvaluationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puan: { type: Number, required: true },
  yorum: { type: String, required: true }
});

const JobEvaluation = mongoose.model('JobEvaluation', jobEvaluationSchema);

module.exports = JobEvaluation;
