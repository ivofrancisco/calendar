// Class that generates a calendar in wich users are able to switch 
// between months. It is prepared to help perform databases queries due to an
// HTML attribute accessible when clicking in a given day (not activated by default).
class Calendar {
    constructor() {
        // Current date
        this.currentDate = new Date();
        // List of months
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // Containers for adding current month and year name
        this.monthDisplay = document.querySelector(".month-display");
        this.yearDisplay = document.querySelector(".year-display");
        // CSS selectors for adding click events in or to 
        // move from one date to another 
        this.prev = document.querySelector(".prev");
        this.next = document.querySelector(".next");
    }

    // Gets and returns data from a given month:
    // Number of days, the month index and the full year
    getData(date, index) {
        // Number of days
        const monthTotal = new Date(date.getFullYear(), (date.getMonth() + index), 0).getDate();
        // The month index
        const monthIndex = new Date(date.getFullYear(), (date.getMonth() + index), 0).getMonth();
        // The full year
        const year = new Date(date.getFullYear(), (date.getMonth() + index), 0).getFullYear();
        // Helps set previous and next months based on current month index
        const ref = index;
        return [monthTotal, monthIndex, year, ref];
    }

    // Converts a total number of given month into an array of objects.
    // Each objects will store: day number, the month index(index and ref), the date's index 
    // and the date in a dateToLocaleString method format
    createMonth(date, index) {
        // Number of days of a given month
        const total = this.getData(date, index)[0];
        // Array to store all objects
        const myArr = [];
        // One is added to the month index to match dateToLocaleString method format
        const month = this.getData(date, index)[1] + 1;
        let i = 1;
        while (i <= total) {
            const created = {};
            created["number"] = i;
            created["ref"] = index;
            created["month"] = month;
            created["year"] = this.getData(date, index)[2];
            // Zero is removed of added to match dateToLocaleString method format
            created["date"] = `${this.toggleZero(i)}/${this.toggleZero(month)}/${this.getData(date, index)[2]}`;
            myArr.push(created);
            i++;
        }
        return myArr;
    }

    // Organises the month containing month's data and return an
    // array in a calendar like format
    setFormat(previous, current, next, start) {
        // Number of spaces in calendar layout
        const limit = 42;
        const prev = previous.splice(-start);
        const previousAndCurrent = prev.length + current.length;
        const remaining = limit - previousAndCurrent;
        return [...prev, ...current, ...(next.slice(0, remaining))];
    }

    // Generates and returns HTML for each day 
    generateHtml(days, wrapper) {
        days.forEach(item => {
            const html = `<div data-date="${item.date}" class="${(item.ref !== 1) ? "day outer-day" : "day"} ${this.highLight(item.date)}">${item.number}</div>`;
            wrapper.innerHTML += html;
        });
    }

    // Display days in a calendar like format
    displayDays(wrapper) {
        // Previous, current and next Month's
        const previousMonth = this.createMonth(this.currentDate, 0);
        const currentMonth = this.createMonth(this.currentDate, 1);
        const nextMonth = this.createMonth(this.currentDate, 2);
        // Month first week day
        const weekDay1 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()).getDay();
        // Array of day objects every time weekDay1 is
        // greater not equal to 0: includes all 3 month's
        const regular = this.setFormat(previousMonth, currentMonth, nextMonth, weekDay1);
        // Array of day objects every time weekDay1 is
        // is equal to 0: excludes previous month
        const excepcional = this.setFormat(previousMonth, currentMonth, nextMonth, previousMonth.length);
        // Clean wrapper div before updating
        wrapper.innerHTML = " ";
        // Selecting calendar format 
        (weekDay1 !== 0) ? this.generateHtml(regular, wrapper) : this.generateHtml(excepcional, wrapper);
        // Adding current month and year names respectivelly
        this.monthDisplay.innerHTML = this.months[this.currentDate.getMonth()];
        this.yearDisplay.innerHTML = this.currentDate.getFullYear();
    }

    // Adding or removing a zero in a given number
    toggleZero(num) {
        return (parseInt(num) < 10) ? ("0" + num.toString()) : (num);
    }

    // Adding active state to day HTML element based on it's data-date attribute
    highLight(item) {
        const date = new Date().toLocaleDateString();
        return (item === date) ? " today" : "";
    }

    // Move from a date to another adding or decreasing month's index
    addMonth(index, wrapper) {
        this.currentDate.setMonth(this.currentDate.getMonth() + (index));
        // Updating days in a calendar
        this.displayDays(wrapper);
    }
}

// Calendar container element
const calendar = document.querySelector(".calendar-body");

// Instantianting class and displaying calendar
const myCalendar = new Calendar();
myCalendar.displayDays(calendar);

// Moving a month back
myCalendar.prev.addEventListener("click", () => {
    myCalendar.addMonth(-1, calendar);
});
// Moving a month forward
myCalendar.next.addEventListener("click", () => {
    myCalendar.addMonth(1, calendar);
})
