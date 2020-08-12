const { body, check } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'addProduct': {
            console.log('val')
            return [
                body('_id', 'product_id does not exists').exists(),
                body('created_by', 'product_id does not exists').exists(),
                body('title', 'title does not exists').exists(),
                body('department').optional(),
                body('description').optional(),
                body('price').optional(),
                body('status').optional(),
                body('imageURL').optional()
                // body('phone').optional().isInt(),
                // body('status').optional().isIn(['enabled', 'disabled'])
            ]
        }
        case 'addProducts': {
            //  return [ 
            //     check('myArray').isArray().custom(a => {
            //         return a.every( e => {
            //             if(!e.product_id){
            //                 return false
            //             }else if(!e.title){
            //                 return false
            //             }else{
            //                 return true 
            //             }
            //         })
            //     }).withMessage('product_id or title missing')
            //    ] 
            return [
                body().isArray(),
                body('*._id', 'product_id does not exists').exists(),
                // body('*.created_by', 'created_by does not exists').exists(),
                body('*.title', 'title does not exists').exists(),
                body('*.department').optional(),
                body('*.description').optional(),
                body('*.price').optional(),
                body('*.status').optional(),
                body('*.imageURL').optional()
            ]
        }
        case 'createUser': {
            return [
                body('first_name', 'first_name does not exists').exists({ checkFalsy: true }),
                body('last_name', 'last_name does not exists').exists({ checkFalsy: true }),
                body('email_id', 'email_id does not exists').exists({ checkFalsy: true }),
                body('password', 'password does not exists').exists({ checkFalsy: true }),
                body('phone_no', 'phone_no does not exists').exists({ checkFalsy: true }).isInt(),
                body('user_type', 'user_type does not exists').exists({ checkFalsy: true }).isInt().isIn([0, 1, 2, 3]),
                //address
                body('address_line1').optional(),
                body('address_line2').optional(),
                body('city').optional(),
                body('state').optional(),
                body('pincode').optional()
                // body('phone').optional().isInt(),
                // body('status').optional().isIn(['enabled', 'disabled'])
            ]
        }
        

    }
}

