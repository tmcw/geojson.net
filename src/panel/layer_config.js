import React from "react";

export default ({ onCancel, onSubmit }) => (
  <div className="w-100 fw4">
    <form onSubmit={onSubmit}>
      <div className="mb3">
        <label htmlFor="id" className=" b db mb1">
          ID
        </label>
        <input
          id="id"
          name="id"
          type="text"
          className="input-reset ba b--black-20 pa2 mb1 db w-100"
          aria-describedby="id-desc"
          required
        />
        <div id="id-desc">A unique identifier for the layer.</div>
      </div>
      <div className="mb3">
        <label htmlFor="title" className=" b db mb1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input-reset ba b--black-20 pa2 mb1 db w-100"
          aria-describedby="title-desc"
          required
        />
        <div id="title-desc">A descriptive name for the layer.</div>
      </div>
      <div className="mb3">
        <label htmlFor="url" className="fw6 db mb1">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="text"
          className="input-reset ba b--black-20 pa2 mb1 db w-100"
          aria-describedby="url-desc"
          required
        />
        <div id="url-desc">A url template for the layer.</div>
      </div>
      <div className="mb3">
        <label htmlFor="attribution" className="fw6 db mb1">
          Attribution
        </label>
        <input
          id="attribution"
          name="attribution"
          type="text"
          className="input-reset ba b--black-20 pa2 mb1 db w-100"
          aria-describedby="attribution-desc"
          required
        />
        <div id="url-desc">Layer attribution(s).</div>
      </div>
      <div className="flex items-center justify-end">
        <input
          className="fw6 ph3 pv2 bn input-reset pointer bg-near-white hover-bg-yellow mr3"
          type="submit"
          value="Cancel"
          onClick={onCancel}
        />
        <input
          className="fw6 ph3 pv2 bn input-reset pointer bg-light-gray hover-bg-yellow"
          type="submit"
          value="Submit"
        />
      </div>
    </form>
  </div>
);
