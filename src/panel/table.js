import React from "react";
import "tachyons/css/tachyons.css";

export default class Table extends React.Component {
  render() {
    const { geojsonObject } = this.props;
    const features = geojsonObject.features;
    const allProperties = [
      ...new Set(
        features.reduce((memo, f) => {
          return memo.concat(Object.keys(f.properties || {}));
        }, [])
      )
    ];
    return (
      <div>
        <table className="ba b--black-10 collapse">
          <thead>
            <tr>
              {allProperties.map(prop => {
                return <th className="tl ba pa1">{prop}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {features.map(feature => {
              return (
                <tr>
                  {allProperties.map(prop => {
                    return (
                      <td className="ba">
                        <input
                          className="pa1 bn"
                          type="text"
                          value={feature.properties[prop]}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
