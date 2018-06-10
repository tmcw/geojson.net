import React from "react";
import "tachyons/css/tachyons.css";

export default ({onCancel, onSubmit}) => (
  <div className="w-100">
    <form onSubmit={onSubmit}>
      <label htmlFor="id" className="f6 b db mb2">ID</label>
      <input 
        id="id" 
        name="id"
        type="text" 
        className="input-reset ba b--black-20 pa2 mb2 db w-100" 
        aria-describedby="id-desc" 
        required
        />
      <small id="id-desc" className="f6 black-60 db mb2">A unique identifier for the layer.</small>
      <label htmlFor="title" className="f6 b db mb2">Title</label>
      <input 
        id="title" 
        name="title"
        type="text" 
        className="input-reset ba b--black-20 pa2 mb2 db w-100" 
        aria-describedby="title-desc" 
        required
        />
      <small id="title-desc" className="f6 black-60 db mb2">A descriptive name for the layer.</small>
      <label htmlFor="url" className="f6 b db mb2">URL</label>
      <input 
        id="url" 
        name="url"
        type="text" 
        className="input-reset ba b--black-20 pa2 mb2 db w-100" 
        aria-describedby="url-desc" 
        required
        />
      <small id="url-desc" className="f6 black-60 db mb2">A url template for the layer.</small>
      <label htmlFor="attribution" className="f6 b db mb2">Attribution</label>
      <input 
        id="attribution" 
        name="attribution"
        type="text" 
        className="input-reset ba b--black-20 pa2 mb2 db w-100" 
        aria-describedby="attribution-desc" 
        required
        />
      <small id="url-desc" className="f6 black-60 db mb2">Layer attribution(s).</small>
      <input 
        className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib" 
        type="submit" 
        value="Cancel"
        onClick={onCancel} />
      <input 
        className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib" 
        type="submit" 
        value="Submit" />
    </form>
  </div>
);
