// Import Middleware
const validate = require('./middlewares/validate');
const jwtService = require('./middlewares/jwt');
const { Router } = require('express');
// Import controller
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');
const balanceController = require('./controllers/balance');
const orderController = require('./controllers/order');
const transactionController = require('./controllers/transaction');

const { UserModel, BzproductsModel, CartModel, OrderModel, BalanceModel } = require('../db/index');
const router = Router();
// Load validation middleware
validate(router);

// file upload
const upload = require('./middlewares/uploadMiddleware');
const path = require('path');
const Resize = require('../Resize');

// bazaar image upload and user model bz_photo field update
router.post('/images/bazaar/:id', upload.single('bz_photo'), async function(req, res) {
    const imagePath = path.join(__dirname, '../../front1/src/assets');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.json({
            status: 'error',
            payload: 'Please provide an image'
        });
    }
    const filename = await fileUpload.save(req.file.buffer);
    authController.bazaarImage(req.params.id, filename)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

// bazaar product image upload and return image file name
router.post('/images/bazaarProd', upload.single('bzp_photo'), async function(req, res) {
    const imagePath = path.join(__dirname, '../../front1/src/assets');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    }
    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({ name: filename });
});

router.post('/register', (req, res) => {
    authController.register(req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Login API
router.post('/login', (req, res) => {
    authController.login(req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Analytics API
router.get('/analytics', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    dashboardController.analytics()
        .then(result => res.json({
            status: 'success',
            payload: result
        }))
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

//Send money API
router.post('/send', jwtService.checkUser() /* Required logged user */ , (req, res) => {
    // Get wallet of user from req.user ( come from jwt token )
    balanceController.sendBTC(req.user, req.body).then(result => {
        res.json({
            status: 'success',
            payload: result
        });
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.post('/recordOrder', jwtService.checkUser(), (req, res) => {
    orderController.add(req.body, req.user.userid).then(result => {
        if (result == true) {
            res.json({
                status: 'success'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.post('/cancelOrder', jwtService.checkUser(), (req, res) => {
    orderController.cancel(req.body).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

router.get('/getLCPrice', jwtService.checkUser(), (req, res) => {
    orderController.getLCPrice().then(result => {
        res.send(result);
    });
});

router.get('/getBalance', jwtService.checkUser(), (req, res) => {
    balanceController.checkNetwork(req.user).then(result => {
        res.send(result);
    });
});

router.get('/getOpenOrders', jwtService.checkUser(), (req, res) => {
    orderController.getOpenOrders(req.user.userid).then(result => {
        res.send(result);
    });
});

router.get('/getSuccessfulOrders', jwtService.checkUser(), (req, res) => {
    orderController.getSuccessOrders(req.user.userid).then(result => {
        res.send(result);
    });
});

router.get('/getAllTransactions', jwtService.checkUser(), (req, res) => {
    transactionController.getAllTransactions(req.user.userid).then(result => {
        res.send(result);
    });
});

router.get('/getReferredCount', jwtService.checkUser(), (req, res) => {
    authController.getReferredCount(req.user.userid).then(result => {
        res.send({
            result
        });
    }).catch(err => {
        console.log('err');
        console.log(err);
    });
});

router.get('/getConversionLimit', jwtService.checkUser(), (req, res) => {
    orderController.getConversionLimit(req.user.userid).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getBTCStocks', jwtService.checkUser(), (req, res) => {
    orderController.getStocks().then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/reset', (req, res) => {
    dashboardController.reset().then(() => {
        res.send({
            status: 'success',
            payload: 'The system has been reset successfully.'
        });
    }).catch(err => {
        res.send({
            status: 'error',
            payload: err
        });
    });
});

router.get('/getLcBalance/:id', (req, res) => {
    balanceController.getLCBalance(req.params.id).then(result => {
        res.send({
            value: result
        });
    });
});

router.get('/getBazaarInfo/:id', (req, res) => {
    authController.getBazaarInfo(req.params.id).then(result => {
        res.send(result);
    });
});

// create bazaar = update user collection
router.post('/bazaarCreate/:id', (req, res) => {
    authController.bazaarCreate(req.params.id, req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

// create bazaar product
router.post('/bzprodCreate/:id', (req, res) => {
    authController.bzprodCreate(req.params.id, req.body)
        .then(result => {
            res.json({
                status: 'success',
                payload: result
            });
        })
        .catch(err => res.status(400).json({
            status: 'error',
            payload: err
        }));
});

router.get('/getBazaars/:country', (req, res) => {
    UserModel.find({
        user_country: req.params.country,
        bz_flag: 1
    }).exec(function(err, bazaars) {
        if (err) {
            console.log(err);
        } else {
            res.json(bazaars);
        }
    });
});

router.get('/getBazaarProducts/:userid', (req, res) => {
    BzproductsModel.find({
        userid: req.params.userid,
        is_deleted: 'N'
    }).exec(function(err, bazaarproducts) {
        if (err) {
            console.log(err);
        } else {
            res.json(bazaarproducts);
        }
    });
});

// check user's cart record
function findCartRecord(userid, pro_id) {
    return CartModel.findOne({
        userid: userid,
        bz_pro_id: pro_id,
        is_deleted: 'N'
    });
}

// add to cart product
router.post('/addToCart', (req, res) => {
    findCartRecord(req.body.userid, req.body.bz_pro_id).then(record => {
        if (record) {
            res.json({
                status: 'already',
                payload: 'Already exist in your cart.'
            });
        } else {
            authController.addToCart(req.body)
                .then(result => {
                    res.json({
                        status: 'success',
                        payload: result
                    });
                })
                .catch(err => res.status(400).json({
                    status: 'error',
                    payload: err
                }));
        }
    });
});

// remove product from cart
router.post('/removeProductFromCart', (req, res) => {
    const cart_id = parseInt(req.body.cart_id);
    const filter = { cart_id: cart_id };
    const update = { is_deleted: 'Y' };
    CartModel.findOneAndUpdate(filter, update, function(err, doc) {
        if (doc) {
            res.send(true);
        } else if (err) {
            res.send(false);
        }
    });
});

// get cart count
router.get('/getCartCount/:userid', (req, res) => {
    CartModel.collection.countDocuments({
        userid: parseInt(req.params.userid),
        is_deleted: 'N'
    }, function(err, total) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                total: total
            });
        }
    });

});

// get precheckout info
router.get('/getPreCheckoutInfo/:userid', (req, res) => {
    const userid = parseInt(req.params.userid);
    CartModel.aggregate([{
            $match: {
                userid: userid,
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, precheckoutInfo) {
        if (err) {
            console.log(err);
        } else {
            res.json(precheckoutInfo);
        }
    });
});

// get user claim information for precheckout page
router.post('/claim', jwtService.checkUser(), (req, res) => {
    orderController.getClaimInformation(req.body.shop_id, req.body.userid).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(400).json({
            status: 'error',
            payload: err
        });
    });
});

// get user open (pending) oders information for open-order page
router.post('/userOpenOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'pending',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, openOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(openOrders);
        }
    });
});

// order status update and product availability update for open order page
router.post('/updateOrderToUnclaim', jwtService.checkUser(), (req, res) => {
    orderController.updateOrderStatusAndLcToBtc(req.body.userid, req.body.orderid, req.body.lctobtc, 'unclaim');
    orderController.updateAvailability(req.body.bz_pro_id, req.body.quantity);
    res.json({
        status: 'success',
        payload: 'order status and product availability update success'
    });
});

// cancel precheckout at open order page
router.post('/cancelPrecheckout', jwtService.checkUser(), (req, res) => {
    OrderModel.findOneAndUpdate({ orderid: req.body.orderid }, { status: 'cancel', update_time: Date.now() }).exec(async function(err, result) {
        if (err) {
            console.log('find precheckout record error ' + err);
            await res.json({
                status: 'error',
                payload: 'find precheckout record error'
            });
        } else {
            BalanceModel.findOneAndUpdate({ userid: req.body.userid }, { lc: req.body.lcamount, update_time: Date.now() }).exec(async function(err, result) {
                if (err) {
                    console.log('find user balance record error ' + err);
                    await res.json({
                        status: 'error',
                        payload: 'find user balance record error'
                    });
                } else {
                    console.log(result);
                    await res.json({
                        status: 'success',
                        payload: 'Added lc amount to user balance'
                    });
                }
            });
        }
    });
});

// get user (buyer) unclaim order information for unclaim order page
router.post('/buyerUnclaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'unclaim',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, unclaimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(unclaimOrders);
        }
    });
});

// get seller unclaim order information for unclaim order page
router.post('/sellerUnclaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                shop_id: userid,
                status: 'unclaim',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, unclaimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(unclaimOrders);
        }
    });
});

// get buyer's agent information for seller unclaim order page
router.post('/agentInfo', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.buyerid);
    UserModel.find({ userid: userid }, 'agent_id').exec(function(err, agent) {
        if (err) {
            console.log(err);
        } else {
            res.json(agent);
        }
    });
});

// order status update unlcaim -> claim
router.post('/updateOrderToClaim', jwtService.checkUser(), (req, res) => {
    orderController.updateOrderStatus(req.body.userid, req.body.orderid, 'claim');
    res.json({
        status: 'success',
        payload: 'Order Status updated'
    });
});

// increase lc balance of user
router.post('/increaseLcBalance', jwtService.checkUser(), (req, res) => {
    balanceController.increaseLcAmount(req.body.userid, req.body.amount);
    console.log(res);
});

// get claimed orders for buyer at claim order page
router.post('/buyerClaimOrders', jwtService.checkUser(), (req, res) => {
    const userid = parseInt(req.body.userid);
    OrderModel.aggregate([{
            $match: {
                userid: userid,
                status: 'claim',
                is_deleted: 'N'
            }
        },
        {
            $sort: { update_time: -1 }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'shop_id',
                foreignField: 'userid',
                as: 'Baz_Info'
            }
        }
    ]).exec(function(err, claimOrders) {
        if (err) {
            console.log(err);
        } else {
            res.json(claimOrders);
        }
    });
});

// get sales Inventory for seller at sales inventory page
router.post('/getSalesInventory', jwtService.checkUser(), (req, res) => {
    const shop_id = parseInt(req.body.shop_id);
    OrderModel.aggregate([{
            $match: {
                shop_id: shop_id,
                status: 'claim',
                is_deleted: 'N'
            }
        },
        {
            $sort: { update_time: -1 }
        },
        {
            $lookup: {
                from: 'bzproducts',
                localField: 'bz_pro_id',
                foreignField: 'bz_pro_id',
                as: 'Pro_Info'
            }
        }
    ]).exec(function(err, salesInventory) {
        if (err) {
            console.log(err);
        } else {
            res.json(salesInventory);
        }
    });
});

// get max lctobtc value for sales inventory page
router.post('/getMaxLcToBtc', jwtService.checkUser(), (req, res) => {
    const shop_id = parseInt(req.body.shop_id);
    OrderModel.find({
        shop_id: shop_id
    }, 'lctobtc').sort({ lctobtc: -1 }).limit(1).then(lctobtc => {
        if (lctobtc) {
            res.json({
                status: 'success',
                payload: lctobtc[0].lctobtc
            });
        } else {
            res.json({
                status: 'error',
                payload: 'no sales inventory record'
            })
        }
    });
});

// get min lctobtc value for sales inventory page
router.post('/getMinLcToBtc', jwtService.checkUser(), (req, res) => {
    const shop_id = parseInt(req.body.shop_id);
    OrderModel.find({
        shop_id: shop_id
    }, 'lctobtc').sort({ lctobtc: 1 }).limit(1).then(lctobtc => {
        if (lctobtc) {
            res.json({
                status: 'success',
                payload: lctobtc[0].lctobtc
            });
        } else {
            res.json({
                status: 'error',
                payload: 'no sales inventory record'
            })
        }
    });
});

// get product data for edit
router.post('/productEdit', jwtService.checkUser(), (req, res) => {
    const bzp_id = parseInt(req.body.bzp_id);
    BzproductsModel.find({
        bz_pro_id: bzp_id
    }).exec(function(err, bzp) {
        if (err) {
            console.log('product get for edit error ' + err);
        } else {
            res.json(bzp);
        }
    });
});

// product edit and update bazaar product
router.post('/bzprodUpdate/:bzp_id', (req, res) => {
    const tmp = parseInt(req.params.bzp_id);
    const total_indirect_savings = parseInt(req.body.total_indirect_savings);
    var update_info = {
        bp_name: req.body.bp_name,
        bzp_photo: req.body.bzp_photo,
        bzp_type: req.body.bzp_type,
        product_description: req.body.product_description,
        update_time: Date.now()
    };
    if (total_indirect_savings != 0) {
        update_info['total_indirect_savings'] = req.body.total_indirect_savings;
        update_info['agent_savings'] = req.body.agent_savings;
        update_info['assigned_savings'] = req.body.assigned_savings;
        update_info['availability'] = req.body.availability;
        update_info['control_cc_price'] = req.body.control_cc_price;
        update_info['control_lc_price'] = req.body.control_lc_price;
        update_info['initial_cc_price'] = req.body.initial_cc_price;
        update_info['initial_lc_price'] = req.body.initial_lc_price;
        update_info['lc_btc'] = req.body.lc_btc;
        update_info['lc_cc'] = req.body.lc_cc;
        update_info['personal_savings'] = req.body.personal_savings;
        update_info['total_product_costs'] = req.body.total_product_costs;
    }
    BzproductsModel.findOneAndUpdate({
        bz_pro_id: tmp
    }, update_info).exec(function(err, rs) {
        if (rs) {
            res.json({
                status: 'success',
                payload: 'product update success'
            });
        } else {
            res.json({
                status: 'errer',
                payload: err
            });
        }
    });
});

// bazaar product delete
router.post('/deleteProduct', jwtService.checkUser(), (req, res) => {
    const bz_pro_id = parseInt(req.body.bz_pro_id);
    var update_info = {
        is_deleted: 'Y',
        update_time: Date.now()
    };
    BzproductsModel.findOneAndUpdate({
        bz_pro_id: bz_pro_id
    }, update_info).exec(function(err, rs) {
        if (rs) {
            res.json({
                status: 'success',
                payload: 'product delete success'
            });
        } else {
            res.json({
                status: 'errer',
                payload: err
            });
        }
    });
});

// get promo proucts for promo page
router.post('/getPromoProducts', jwtService.checkUser(), (req, res) => {
    BzproductsModel.aggregate([{
            $match: {
                user_country: req.body.user_country,
                bzp_type: 'promo',
                is_deleted: 'N'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userid',
                foreignField: 'userid',
                as: 'Baz_Info'
            }
        }
    ]).exec(function(err, promoItems) {
        if (err) {
            console.log(err);
        } else {
            res.json(promoItems);
        }
    });
});

module.exports = router;