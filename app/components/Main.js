// Include React
var React = require("react");

// UN COMMENT ALL THESE LATER!
// Here we include all of the sub-components
var Query = require("./children/Query.js");
var Search = require("./children/Search.js");
var Saved = require("./children/Saved.js");

// Requiring our helper for making API calls
var helpers = require("../utils/helpers.js");

// Create the Main Component
var Main = React.createClass({

  // Here we set a generic state
  getInitialState: function() {
    return {
      apiResults: [],
      mongoResults: [],
      searchTerms: ["","",""]
    };
  },

  // These functions allow children to update the parent.
  _setSearchFields: function(topic, start, end) {
    this.setState({ searchTerms: [topic, start, end] });
  },

  // Allow child to update Mongo data array
  _resetMongoResults: function(newData){
    this.setState({ mongoResults: newData} );
  },

  // After the Main renders, collect the saved articles from the API endpoint
  componentDidMount: function() {

    // Hit the Mongo API to get saved articles
    helpers.apiGet().then(function(query){
      this.setState({mongoResults: query.data});
    }.bind(this));
  },


  // If the component changes (i.e. if a search is entered)...
  componentDidUpdate: function(prevProps, prevState) {

    // Only hit the API once; i.e. if the prev state does not equal the current
    if(this.state.searchTerms != prevState.searchTerms){
      // Run the query for the address
      helpers.articleQuery(this.state.searchTerms[0], this.state.searchTerms[1], this.state.searchTerms[2]).then(function(data) {
        //console.log(data);
        this.setState({ apiResults: data });
      }.bind(this));
    }

  },


  // Here we render the function
  render: function() {
    return (

      <div className="container" style={ {backgroundColor: "white", borderStyle: "solid", borderWidth: "1px"} }>

        <div className="page-header">
          <h1 className="text-center"><u>New York Times Article Search</u></h1>
          <br />
          <h3 className="text-center" style={ {marginTop: "-12px"} }><i>A React Rendition</i></h3>
          <h4 className="text-center">Search for and annotate articles of interest. Click on headlines to learn more.</h4>
        </div>

        <Query _setSearchFields={this._setSearchFields} />
        <Search apiResults={this.state.apiResults} _resetMongoResults={this._resetMongoResults} />
        <Saved mongoResults={this.state.mongoResults} _resetMongoResults={this._resetMongoResults} />

      </div>

    );
  }
});

// Export the component back for use in other files
module.exports = Main;