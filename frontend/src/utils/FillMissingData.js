import dayjs from "dayjs";

export function fillMissingDate(data, start_date, end_date) {

    let output = [];
    // Declare a variable to store the account_id
    let account_id = null;
    // Declare a variable to store the balance
    let balance = null;
    // Declare a variable to store the index of the current object in the data array
    let index = 0;

    // Check if there is an object with initial true and there are two objects with the same year-month-day
    let initialIndex = data.findIndex(obj => obj.initial === true); // Find the index of the object with initial true
    if (initialIndex !== -1) { // If there is such an object
        let initialDate = dayjs(data[initialIndex].date); // Get its date
        let duplicateIndex = data.findIndex((obj, i) => i !== initialIndex && dayjs(obj.date).isSame(initialDate, 'day')); // Find the index of another object with the same date
        if (duplicateIndex !== -1) { // If there is another object with the same date
            balance = data[initialIndex].balance; // Use the balance of the object with initial true
            account_id = data[initialIndex].account_id; // Use the account_id of the object with initial true
            data.splice(initialIndex, 1); // Remove the object with initial true from the data array
        }
    }

    //  Assign the default values from the object with initial true to the account_id and balance variables
    if (account_id === null || balance === null) {
        account_id = data[0].account_id;
        balance = data[0].balance;
    }

    // Loop through the days from start to end
    while (start_date <= end_date) {
        // Format the date as YYYY-MM-DD
        let date = start_date.format("YYYY-MM-DD");
        // Find the matching object in the data array using dayjs()
        if (index < data.length && dayjs(data[index].date).isSame(start_date, 'day')) {
            // Update the account_id and balance with the current object's values
            account_id = data[index].account_id;
            balance = data[index].balance;
            // Push it to the output array
            output.push(data[index]);
            index = index + 1;
        } else {
            // Use the previous account_id and balance
            output.push({ "account_id": account_id, "balance": balance, "date": date });
        }
        start_date = start_date.add(1, "day");
    }
    // Return the output array
    console.log(output);
    return output;
}