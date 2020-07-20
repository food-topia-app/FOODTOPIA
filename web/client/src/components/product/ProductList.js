import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import ListItem from "./ListItem";
import { productList } from "../../actions/productActions";

const ProductList = ({ product: { products }, productList }) => {
  useEffect(() => {
    productList();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <Link to="/product/add">
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
            Add Product
          </button>
        </Link>
      </div>
      <div id="productList">
        <h1>Products</h1>
        {products.length < 1 ? (
          <h3>No products to show</h3>
        ) : (
          products.map((product, key) => <ListItem key={key} {...product} />)
        )}
      </div>
      {/* <div id='serviceList'>
				<h1>Services</h1>
				{services.length < 1 ? (
					<h3>No services to show</h3>
				) : (
					services.map((service, key) => <ListItem key={key} {...service} />)
				)}
			</div> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  product: state.product,
});

ProductList.propTypes = {
  product: PropTypes.object.isRequired,
  productList: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { productList })(ProductList);
