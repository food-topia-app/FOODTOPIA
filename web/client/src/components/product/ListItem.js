import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ListItem = ({
  _id,
  name,
  description,
  category,
  quantity,
  rate,
  sellerName,
  sellerNumber,
  stock,
  type,
  unit,
}) => (
  <div className="product mdl-card mdl-shadow--2dp">
    <div
      className="mdl-card__image"
      style={{ backgroundImage: `url(/img/${_id})` }}
    ></div>
    <div className="mdl-card__title">
      <h2 className="mdl-card__title-text">{name}</h2>
    </div>
    <div className="mdl-card__supporting-text">
      <p>{description}</p>
      <p>Category: {category}</p>
      <p>
        {"₹ " + rate}
        {type ? " per " + quantity + " " + unit : ""}
        <br />
      </p>
      {stock !== null && (
        <p>
          {"Remaining Stock: " + stock}
          <br />
        </p>
      )}
      {/* {sellerName != null && (
				<p>{'Seller Info: ' + sellerName + ', ' + sellerNumber}</p>
			)} */}
    </div>
    <div className="mdl-card__actions mdl-card--border">
      <Link
        to={"/product/edit/" + _id}
        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
      >
        Edit
      </Link>
      <Link
        to={"/product/remove/" + _id}
        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
      >
        Remove
      </Link>
    </div>
  </div>
);

ListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ListItem;
