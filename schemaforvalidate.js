const Joi  =require("joi");
module.exports.listSchema = Joi.object({
    listing:Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image:Joi.string().allow("",null),
        price : Joi.number().min(0).required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
    })
    .required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().max(5).min(1),
        comment : Joi.string().required()
    }).required()
});