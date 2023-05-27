/**
 * @author El Hovik
 * CS 132
 *
 * Starter code for the APOD program to fetch and display the Astronomy 
 * Photo of the Day from the NASA API.
 */
(function(){
  "use strict";

  // SAMPLE APOD JSON RESPONSE
  const DEMO_DATA = {
    copyright: "Mike Selby",
    date: "2022-05-06",
    explanation: "NGC 3199 lies about 12,000 light-years away, a glowing cosmic cloud in the nautical southern constellation of Carina. The nebula is about 75 light-years across in this narrowband, false-color view.  Though the deep image reveals a more or less complete bubble shape, it does look very lopsided with a much brighter edge along the top. Near the center is a Wolf-Rayet star, a massive, hot, short-lived star that generates an intense stellar wind. In fact, Wolf-Rayet stars are known to create nebulae with interesting shapes as their powerful winds sweep up surrounding interstellar material. In this case, the bright edge was thought to indicate a bow shock produced as the star plowed through a uniform medium, like a boat through water. But measurements have shown the star is not really moving directly toward the bright edge. So a more likely explanation is that the material surrounding the star is not uniform, but clumped and denser near the bright edge of windblown NGC 3199.",
    hdurl: "https://apod.nasa.gov/apod/image/2105/ColombariNGC3199.jpg",
    media_type: "image",
    service_version: "v1",
    title: "Windblown NGC 3199",
    url: "https://apod.nasa.gov/apod/image/2105/ColombariNGC3199_1024.jpg"
  }
  // From url: https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
  // get your own key from: https://api.nasa.gov

  const NASA_BASE_URL = "https://api.nasa.gov/planetary/apod?";
  const API_KEY = "DEMO_KEY";

  /**
   * Sets up the button listener to fetch data from the APOD API to 
   * display the astronomy photo of the day on the page.
   */
  function init() {
    qs("#apod-btn").addEventListener("click", () => { 
      processAPODData(DEMO_DATA) 
    });
    // TODO: Change this to use fetch instead of local JSON.
    // qs("#apod-btn").addEventListener("click", fetchAPOD);
  }

  /**
   * Makes the fetch call to NASA's APOD API.
   * Upon success, shows the Astronomy Photo of the Day on the page.
   * If an error occurs, displays a message on the page appropriately.
   */
  function fetchAPOD() {
    // display loading text and disable button while ajax call is loading
    qs("#response-message").textContent = "Response Loading ...";
    qs("#response").innerHTML = "";
    qs("#apod-btn").disabled = true;

    // TODO: Build URL, start fetch call chain
  }

  /**
   * Processes the response to display APOD information on the page
   * with text content and the photo of the day. 
   * @param {Object} apodJson - the parsed JSON object that is was returned 
   * from the request.
   */
  function processAPODData(apodJson){
    // clear response box
    qs("#response-message").textContent = "Response";

    // See sample json response above
    let title = document.createElement("h2");
    title.textContent = apodJson.title;

    let image = document.createElement("img");
    image.src = apodJson.url;

    let explanation = document.createElement("p");
    explanation.textContent = apodJson.explanation;

    qs("#response").appendChild(title);
    qs("#response").appendChild(image);
    qs("#response").appendChild(explanation);

    // re-enable button
    qs("#apod-btn").disabled = false;
  }

  /**
   * This function is called when an error occurs in the fetch call chain 
   * (e.g. the request returns a non-200 error code, such as when the APOD 
   * service is down). Displays a user-friendly error message on the page and 
   * re-enables the APOD button.
   * @param {Error} err - the error details of the request.
   */
  function handleRequestError(err) {
    // ajax call failed! alert, place text and re-enable the button
    let response = document.createElement("p");
    let msg = "There was an error requesting data from the APOD service. " + 
              "Please try again later.";
    response.textContent = msg;
    qs("#response").appendChild(response);
    qs("#response-message").textContent = "Response";
    qs("#apod-btn").disabled = false; // re-enable the button
  }

  init();
})();
