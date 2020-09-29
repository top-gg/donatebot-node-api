const axios = require('axios');

const baseURL = "https://donatebot.io/api/v1";
const userAgent = "Donate-Bot-Node-API/1.0.3";

/**
 * Create a new instance of Donate Bot Node API
 * @param  {Object}  options
 * @param  {string}  options.serverID  Your server ID
 * @param  {string}  options.apiKey    Your Donate Bot API key
 * @return {Object}                    An object of functions to call
 */
module.exports = function(options) {

    // Options {
    //      serverID: "Your Discord Server ID",
    //      apiKey: "Your Donate Bot API key from the panel"
    // }
    // 
    var checkOptions = function () {
        if (options.serverID === "" || options.serverID === undefined || options.serverID === null || typeof options.serverID !== "string") {
            return "Please provide a valid Discord server ID as a string."
        }
        if (options.apiKey === "" || options.apiKey === undefined || options.apiKey === null || typeof options.serverID !== "string") {
            return "Please provide a valid Donate Bot API key."
        }
        return "";
    }

    /**
     * Get new donations that have not been marked as processed
     * @param  {Object} getOptions
     * @param  {string[]}  getOptions.find An array containing statuses Ex: "Completed", "Reversed", "Refunded"
     * @return {Promise.<Object[]>}         An array of transactions that have not been marked
     */
    var getNewDonations = function(getOptions) {
        return new Promise(async (resolve, reject) => {
            var checked = checkOptions();

            if (checked !== "") {
                return reject(checked);
            }

            // getOptions: {
            //      find: ["Reversed", "Refunded", "Completed"]
            // }
            var findParams = "";

            if (typeof getOptions === 'object' && getOptions !== null && Array.isArray(getOptions.find)) {
                getOptions.find = getOptions.find.filter(x => {
                    if (x === "Reversed" || x === "Refunded" || x === "Completed") {
                        return true;
                    }
                });

                findParams = getOptions.find.join(',');
            }

            axios({
                method: 'get',
                url: `${baseURL}/donations/${options.serverID}/new`,
                params: {
                    find: findParams
                },
                headers: {
                    "Authorization": options.apiKey,
                    "User-Agent": userAgent
                }
            })
                .then(function (response) {
                    // Return the array of donations
                    return resolve(response.data.donations);
                })
                .catch(function (error) {
                    if (error.response && error.response.data && error.response.data['Error']) {
                        return reject(error.response.data['Error']);
                    }

                    return reject(error);
                });
        });
    }

    /**
     * Get an array of ended subscriptions
     * @return {Promise.<Object[]>} Array of ended subscriptions
     */
    var getEndedSubscriptions = function() {
        return new Promise(async (resolve, reject) => {
            var checked = checkOptions();

            if (checked !== "") {
                return reject(checked);
            }
            
            axios({
                method: 'get',
                url: `${baseURL}/donations/${options.serverID}/endedsubscriptions`,
                headers: {
                    "Authorization": options.apiKey,
                    "User-Agent": userAgent
                }
            })
                .then(function (response) {
                    // Return the array of donations
                    return resolve(response.data.endedSubscriptions);
                })
                .catch(function (error) {
                    if (error.response && error.response.data && error.response.data['Error']) {
                        return reject(error.response.data['Error']);
                    }

                    return reject(error);
                });
        });
    }

    /**
     * Mark a donation or subscription ended as processed after you have done something with it
     * @param  {Object} markOptions
     * @param {Boolean} markOptions.isEndedSubscription If you are marking an ended subscription
     * @param {Boolean} markOptions.markProcessed
     * @return {Promise.<void>} The transaction was completed
     */
    var markDonation = function(markOptions) {
        return new Promise(async (resolve, reject) => {
            var checked = checkOptions();

            if (checked !== "") {
                return reject(checked);
            }

            var defaultMarkOptions = {
                isEndedSubscription: false,
                markProcessed: true
            }

            if (typeof markOptions === 'object' && markOptions !== null) {
                if (markOptions.isEndedSubscription && typeof markOptions.isEndedSubscription === "boolean") {
                    defaultMarkOptions.isEndedSubscription = markOptions.isEndedSubscription;
                }
                if (markOptions.markProcessed && typeof markOptions.markProcessed === "boolean") {
                    defaultMarkOptions.markProcessed = markOptions.markProcessed;
                }
                if (markOptions.txnID && typeof markOptions.txnID === "string") {
                    defaultMarkOptions.txnID = markOptions.txnID;
                } else {
                    return reject("txnID must be provided as a string inside options.")
                }
            } else {
                return reject("An object of options are required for this function. See documentation at https://developers.donatebot.io")
            }
            
            axios({
                method: 'post',
                url: `${baseURL}/donations/${options.serverID}/${defaultMarkOptions.txnID}/mark`,
                headers: {
                    "Authorization": options.apiKey,
                    "User-Agent": userAgent
                },
                data: {
                    isEndedSubscription: defaultMarkOptions.isEndedSubscription,
                    markProcessed: defaultMarkOptions.markProcessed
                }
            })
                .then(function (response) {
                    // Return nothing as the API does not return anything
                    return resolve();
                })
                .catch(function (error) {
                    if (error.response && error.response.data && error.response.data['Error']) {
                        return reject(error.response.data['Error']);
                    }

                    return reject(error);
                });
        });
    }

    return {
        getNewDonations,
        getEndedSubscriptions,
        markDonation
    }
}