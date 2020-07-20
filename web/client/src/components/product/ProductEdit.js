import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { alertShow } from "../../actions/alertActions";
import { productEdit, clearAlert } from "../../actions/productActions";

const ProductEdit = ({
  alertShow,
  product: { alert, products, services },
  productEdit,
  clearAlert,
  history,
  match,
}) => {
  const initialProduct = {
    category: "Veg",
    categoryLabel: "",
    description: "",
    descriptionLabel: "",
    name: "",
    nameLabel: "",
    pic: null,
    quantity: 0,
    quantityLabel: "",
    rate: 0,
    rateLabel: "",
    sellerName: "",
    sellerNameLabel: "",
    sellerNumber: "",
    sellerNumberLabel: "",
    stock: "",
    stockLabel: "",
    unit: "",
    unitLabel: "",
    type: true,
    valid: true,
  };

  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    const pns = products.concat(services);
    const [currentProduct] = pns.filter((a) => {
      return a._id === match.params.id;
    });
    setProduct({
      ...product,
      initial: currentProduct,
      _id: currentProduct._id,
      cateogry: currentProduct.cateogry,
      description: currentProduct.description,
      name: currentProduct.name,
      quantity: currentProduct.quantity,
      rate: currentProduct.rate,
      stock: currentProduct.stock,
      unit: currentProduct.unit,
      type: currentProduct.type,
      category: currentProduct.category,
      valid: false,
    });
    if (alert) {
      alert === "Product updated"
        ? alertShow(alert, "success")
        : alertShow(alert);
      clearAlert();
      if (alert === "Product updated") {
        setProduct(initialProduct);
        history.push("/products");
      }
    }
    // eslint-disable-next-line
  }, [alert]);

  const categoryHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      category: value,
    });
  };

  const descriptionHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      description: value,
      descriptionLabel: value === "" ? " (cannnot be empty)" : "",
      valid:
        value === "" ||
        product.name === "" ||
        product.quantity === 0 ||
        product.rate === 0 ||
        product.unit === "",
    });
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    productEdit(product);
  };

  const nameHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      name: value,
      nameLabel: value === "" ? " (cannnot be empty)" : "",
      valid:
        value === "" ||
        product.description === "" ||
        product.quantity === 0 ||
        product.rate === 0 ||
        product.unit === "",
    });
  };

  const picHandler = (event) => {
    setProduct({
      ...product,
      pic: event.target.files ? event.target.files : null,
    });
  };

  const quantityHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      quantity: value,
      quantityLabel: value === "0" ? " (cannnot be zero)" : "",
      valid:
        value === "" ||
        product.description === "" ||
        product.name === "" ||
        product.rate === 0 ||
        product.unit === "",
    });
  };

  const rateHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      rate: value,
      rateLabel: value === 0 ? " (cannnot be zero)" : "",
      valid:
        value === "" ||
        product.description === "" ||
        product.name === "" ||
        product.quantity === 0 ||
        product.unit === "",
    });
  };

  const sellerNameHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      sellerName: value,
      sellerNameLabel: value === "" ? " (cannnot be empty)" : "",
    });
  };

  const sellerNumberHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      sellerNumber: value,
      sellerNumberLabel: value === "" ? " (cannnot be empty)" : "",
    });
  };

  const stockHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      stock: value,
      stockLabel: value === "" ? " (cannnot be empty)" : "",
    });
  };

  // const typeHandler = ({ target: { value } }) => {
  // 	setProduct({
  // 		...product,
  // 		type: value === 'true',
  // 	})
  // }

  const unitHandler = ({ target: { value } }) => {
    setProduct({
      ...product,
      unit: value,
      unitLabel: value === 0 ? " (cannnot be zero)" : "",
      valid:
        value === "" ||
        product.description === "" ||
        product.name === "" ||
        product.quantity === 0 ||
        product.rate === 0,
    });
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            autoFocus
            className="mdl-textfield__input"
            type="text"
            name="name"
            value={product.name}
            onChange={nameHandler}
          />
          <label className="mdl-textfield__label" htmlFor="name">
            {"Name" + product.nameLabel}
          </label>
        </div>
        <br />
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            className="mdl-textfield__input"
            type="text"
            name="description"
            value={product.description}
            onChange={descriptionHandler}
          />
          <label className="mdl-textfield__label" htmlFor="description">
            {"Description" + product.descriptionLabel}
          </label>
        </div>
        <br />
        <br />
        <label htmlFor="category">
          {"Category " + product.categoryLabel + ":"}
        </label>
        <select
          id="category"
          onChange={categoryHandler}
          value={product.category}
        >
          <option value="Veg">Veg</option>
          <option value="Non Veg">Non Veg</option>
          <option value="Cool Drinks">Cool Drinks</option>
          <option value="Tea">Tea</option>
          <option value="Coffee">Coffee</option>
          <option value="Others">Others</option>
        </select>
        <br />
        {/* <label
					className='mdl-radio mdl-js-radio mdl-js-ripple-effect'
					htmlFor='productType'
				>
					<input
						type='radio'
						id='productType'
						className='mdl-radio__button'
						name='type'
						value={true}
						checked={product.type === true}
						onChange={typeHandler}
					/>
					<span className='mdl-radio__label'>Product</span>
				</label>
				<label
					className='mdl-radio mdl-js-radio mdl-js-ripple-effect'
					htmlFor='serviceType'
				>
					<input
						type='radio'
						id='serviceType'
						className='mdl-radio__button'
						name='type'
						value={false}
						checked={product.type === false}
						onChange={typeHandler}
					/>
					<span className='mdl-radio__label'>Service</span>
				</label> */}
        <br />
        <input
          type="file"
          id="pic"
          name="pic"
          accept="image/jpg, image/jpeg, image/png, image/webp"
          onChange={picHandler}
        />
        <br />
        <br />
        {product.type ? (
          <>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
              <input
                autoFocus
                className="mdl-textfield__input"
                name="quantity"
                value={product.quantity}
                onChange={quantityHandler}
              />
              <label className="mdl-textfield__label" htmlFor="quantity">
                {"Quantity" + product.quantityLabel}
              </label>
            </div>
            <br />
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
              <input
                autoFocus
                className="mdl-textfield__input"
                type="text"
                name="unit"
                value={product.unit}
                onChange={unitHandler}
              />
              <label className="mdl-textfield__label" htmlFor="unit">
                {"Unit" + product.unitLabel}
              </label>
            </div>
            <br />
          </>
        ) : null}
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            autoFocus
            className="mdl-textfield__input"
            type="text"
            name="rate"
            value={product.rate}
            onChange={rateHandler}
          />
          <label className="mdl-textfield__label" htmlFor="rate">
            {"Rate" + product.rateLabel}
          </label>
        </div>
        <br />
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            className="mdl-textfield__input"
            name="stock"
            value={product.stock}
            onChange={stockHandler}
          />
          <label className="mdl-textfield__label" htmlFor="stock">
            {"Stock" + product.stockLabel}
          </label>
        </div>
        <br />
        {/* <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            className="mdl-textfield__input"
            name="sellerName"
            value={product.sellerName}
            onChange={sellerNameHandler}
          />
          <label className="mdl-textfield__label" htmlFor="sellerName">
            {"Seller Name" + product.rateLabel}
          </label>
        </div>
        <br />
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused">
          <input
            className="mdl-textfield__input"
            name="sellerNumber"
            value={product.sellerNumber}
            onChange={sellerNumberHandler}
          />
          <label className="mdl-textfield__label" htmlFor="sellerNumber">
            {"Seller Number" + product.rateLabel}
          </label>
        </div>
        <br /> */}
        <input
          className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          type="submit"
          value="Update Product"
          disabled={product.valid}
        />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  product: state.product,
});

ProductEdit.propTypes = {
  alertShow: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  productEdit: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(
  connect(mapStateToProps, {
    alertShow,
    productEdit,
    clearAlert,
  })(ProductEdit)
);
