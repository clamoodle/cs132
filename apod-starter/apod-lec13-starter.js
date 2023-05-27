/**
 * @author El Hovik
 * CS 132
 *
 * Starter code for the APOD program to fetch and display the Astronomy 
 * Photo of the Day from the NASA API. This program currently has the same
 * functionality as the code we left off with in Lecture 12.
 */
(function () {
  "use strict";

  /*
  Sample JSON response:
  {
    copyright: "Mike Selby",
    date: "2022-05-06",
    explanation: "NGC 3199 lies about 12,000 light-years away, a glowing cosmic cloud in the nautical southern constellation of Carina. The nebula is about 75 light-years across in this narrowband, false-color view.  Though the deep image reveals a more or less complete bubble shape, it does look very lopsided with a much brighter edge along the top. Near the center is a Wolf-Rayet star, a massive, hot, short-lived star that generates an intense stellar wind. In fact, Wolf-Rayet stars are known to create nebulae with interesting shapes as their powerful winds sweep up surrounding interstellar material. In this case, the bright edge was thought to indicate a bow shock produced as the star plowed through a uniform medium, like a boat through water. But measurements have shown the star is not really moving directly toward the bright edge. So a more likely explanation is that the material surrounding the star is not uniform, but clumped and denser near the bright edge of windblown NGC 3199.",
    media_type: "image",
    title: "Windblown NGC 3199",
    url: "https://apod.nasa.gov/apod/image/2105/ColombariNGC3199_1024.jpg"
   }
  */
  const NASA_BASE_URL = "https://api.nasa.gov/planetary/apod?";
  // Get your own API key here: https://api.nasa.gov
  const API_KEY = "DEMO_KEY";

  /**
   * Sets up the button listener to fetch data from the APOD API to 
   * display the astronomy photo of the day on the page.
   */
  function init() {
    qs("#apod-btn").addEventListener("click", () => {
      // The APOD API supports an optional date parameter
      // A valid date is 10 characters (YYYY-MM-DD)
      const date = "2022-05-11";
      fetchAPOD(date);
      // fetchAPODAsync(date);

      // Check out the network tab with each solution to see synchronous vs. asynchronous requests in action!
      // multiFetchRequest();    // async but un-ordered
      // multiSyncRequest();     // sync but ordered
      // multiParallelRequest(); // async and ordered!
    });
  }

  /**
   * Example 1:
   * Makes the fetch call to NASA's APOD API.
   * Upon success, shows the Astronomy Photo of the Day on the page.
   * If an error occurs, displays a message on the page appropriately.
   */
  function fetchAPOD(date) {
    // display loading text and disable button while ajax call is loading
    qs("#response-message").textContent = "Response Loading ...";
    qs("#response").innerHTML = "";
    qs("#apod-btn").disabled = true;
    let url = NASA_BASE_URL;
    // The APOD API requires one parameter: api_key
    // Make sure you paste in your APOD API_KEY for the module-global constant!
    url += "api_key=" + API_KEY;
    // Note: We could also add an optional "date" parameter if we wanted to specify the date
    // of the astronomy photo (see APOD API documentation online)

    //start fetch call chain
    fetch(url + "&date=" + date)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processAPODData)
      .catch(handleRequestError);
  }

  // Begin Examples 2-5 from Lecture 13
  // Example 2: fetchAPODAsync(date);   // single async request
  // Example 3: multiFetchRequest();    // 5 async but un-ordered
  // Example 4: multiSyncRequest();     // 5 sync but ordered
  // Example 5: multiParallelRequest(); // 5 async and ordered!

  /**
   * Example 2: Async version of fetchAPOD function.
   */
  async function fetchAPODAsync(date) {
    let url = URL + "&date=" + date;
    try {
      let resp = await fetch(url)
      resp = checkStatus(resp);
      let data = await resp.json();
      processApodJson(data);
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Helper function for Examples 3-5 to demonstrate async/await vs. standard fetch chain,
   * returning a Promise that resolves to the response JSON and rejects with any
   * possible request error.
   */
  async function fetchOneDay(date) {
    let url = URL + "&date=" + date;
    try {
      let resp = await fetch(url);
      resp = checkStatus(resp);
      let data = await resp.json();
      return data;
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Example 3: 5 requests that are all initiated "simultaneously", but without
   * guaranteed order.
   */
  function multiFetchRequest() {
    let date = "2022-05-0";
    let results = [];
    // ...
  }

  /**
   * Example 4: Using async/await to control order of responses, but using await
   * within the for loop causes a synchronous solution (slower than Example 3)
   */
  async function multiSyncRequest() {
    let date = "2022-05-0";
    for (let i = 1; i <= 5; i++) {
      // ...
    }
  }

  /**
   * Example 5 (best): Using async/await to control order of responses, and Promise.all
   * with await to resolve only when all requests are received, blocking only once.
   * In this solution, we get both the efficiency of sending requests all at once,
   * as well as collecting the result data in the 5-day order.
   */
  async function multiParallelRequest() {
    let date = "2022-05-0";
    let promises = [];
    // ...
  }

  // Begin code not specific to Examples 1-5 of multi-fetch requests

  /**
   * Processes the response to display APOD information on the page
   * with text content and the photo of the day. 
   * @param {Object} apodJson - the parsed JSON object that is was returned 
   * from the request.
   */
  function processAPODData(apodJson) {
    //clear response box
    qs("#response-message").textContent = "Response";

    //See sample json response below
    let title = document.createElement("h2");
    title.textContent = apodJson.title;

    let image = document.createElement("img");
    image.src = apodJson.url;

    let explanation = document.createElement("p");
    explanation.textContent = apodJson.explanation;

    qs("#response").appendChild(title);
    qs("#response").appendChild(image);
    qs("#response").appendChild(explanation);

    //re-enable button
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
    // Note that we don't use the err data in this example. Why?
    // (In your own code, make sure to omit any unused parameters!)
    // fetch request failed! Tell user with helpful message and re-enable the button
    let response = gen("p");
    let msg = "There was an error requesting data from the APOD service " +
      "(it's possible the DEMO_KEY rate limit is used up!) Please try again later.";
    response.textContent = msg;
    qs("#response").appendChild(response);
    qs("#response-message").textContent = "Response";
    qs("#apod-btn").disabled = false;
  }

  // Helper functions id, qs, gen, checkStatus from helpers.js

  init();
})();