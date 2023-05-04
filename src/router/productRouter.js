const express = require('express');
const { productService } = require('../service');
const { productMiddleware } = require('../middleware');

const productRouter = express.Router();

// 전체 상품 조회

// /products?category=1
productRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.category !== undefined) {
      const products = await productService.getProductsByCategory(category);
      res.json(products);
      return;
    }

    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// 카테고리별 상품 목록 조회
// TODO: 위의 상품 조회 코드랑 병합이 필요할 것 같습니다.
// productRouter.get('/category', async (req, res, next) => {
//   try {
//     const { category } = req.query;
//     if (category === undefined && category === null && category === '') {
//       throw new Error('category 잘못 입력 되었습니다.');
//     }

//     const products = await productService.getProductsByCategory(category);
//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// 상품 상세정보 조회
productRouter.get('/:productId', async (req, res, next) => {
  try {
    const productId = req.params.productId;

    if (productId === undefined && productId === null && productId === '') {
      throw new Error('productId가 잘못 입력 되었습니다.');
    }

    const product = await productService.getProductById(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 추가 - 관리자
productRouter.post(
  '/admin/save',
  productMiddleware.validateProduct,
  async (req, res, next) => {
    try {
      const {
        productId,
        productName,
        description,
        price,
        imageUri,
        company,
        category,
      } = req.body;
      const newProduct = {
        productId,
        productName,
        description,
        price,
        imageUri,
        company,
        category,
      };
      const createProduct = await productService.createProduct(newProduct);
      res.status(201).json(createProduct);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = productRouter;
