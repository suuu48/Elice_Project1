const { productDAO } = require('../data-access');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

class ProductService {
  // 상품 전체 조회
  async getAllProducts() {
    try {
      const products = await productDAO.findAll();
      return products;
    } catch (error) {
      throw new AppError(
        commonErrors.businessError,
        500,
        'Business Error로 인해 상품 데이터를 가져오지 못했습니다'
      );
    }
  }
  // 카테고리별 상품 목록 조회
  async getProductsByCategory(category) {
    try {
      const products = await productDAO.findByCategory(category);
      return products;
    } catch (error) {
      throw new AppError(
        commonErrors.businessError,
        500,
        'Business Error로 인해 상품 데이터를 가져오지 못했습니다'
      );
    }
  }
  // 상품 상세정보 조회
  async getProductById(id) {
    try {
      const product = await productDAO.getById(id);
      if (!product) {
        throw new AppError(
          commonErrors.businessError,
          500,
          'Business Error: 해당 상품은 존재하지 않습니다.'
        );
      }
      return product;
    } catch (error) {
      throw new AppError(
        commonErrors.businessError,
        500,
        'Business Error로 인해 해당 상품의 상세정보 조회에 실패하였습니다.'
      );
    }
  }

  // 상품 추가 - 관리자
  async createProduct(product) {
    try {
      const createdProduct = await productDAO.create(product);
      return createdProduct;
    } catch (error) {
      console.error(error);
      throw new AppError(
        commonErrors.businessError,
        500,
        'Business Error로 인해 상품 저장에 실패하였습니다.'
      );
    }
  }
}

module.exports = new ProductService();
