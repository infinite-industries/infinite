
export default class TimeService {

    static returnMinutes (utc_time) {
        const time = new Date(utc_time)
        return time.getMinutes()
    }

    static returnHourMinutesAMPM (utc_time) {
        const time = new Date(utc_time)
        let military_time = time.getHours()
        //console.log(military_time)

        let minutes = time.getMinutes().toString()
        if(minutes.length<2){
            minutes = "0" + minutes // pad minutes to always output two digit format 2:00
        }

        if(military_time == 0) {
            return "12" + ":" + minutes + "am"
        }
        else if(military_time<12){
            return military_time.toString() + ":" + minutes + "am"
        }
        else if(military_time == 12) {
            return "12" + ":" + minutes + "pm"
        }
        else {
            return (military_time-12).toString() + ":" + minutes + "pm"
        }
    }

    static returnDate (utc_time) {
        const time = new Date(utc_time)
        return time.getDate()
    }


    //OPTIMIZE
    //define the array of results
    // var results = [result0, result1, result2, result3, result4, result5, result6,
    //     result7, result8, result9, result10]

    // //return the correct result
    // return results[value];

    static returnMonth (utc_time) {
        const time = new Date(utc_time)
        let month = null

        switch(time.getMonth()) {
            case 0:
                month = "January"
                break
            case 1:
                month = "February"
                break
            case 2:
                month = "March"
                break
            case 3:
                month = "April"
                break
            case 4:
                month = "May"
                break
            case 5:
                month = "June"
                break
            case 6:
                month = "July"
                break
            case 7:
                month = "August"
                break
            case 8:
                month = "September"
                break
            case 9:
                month = "October"
                break
            case 10:
                month = "November"
                break
            case 11:
                month = "December"
                break
        }
        return month
    }

    static returnDay (utc_time) {

        const time = new Date(utc_time)
        let day = null

        switch (time.getDay()) {
            case 0:
                day = "Sunday"
                break
            case 1:
                day = "Monday"
                break
            case 2:
                day = "Tuesday"
                break
            case 3:
                day = "Wednesday"
                break
            case 4:
                day = "Thursday"
                break
            case 5:
                day = "Friday"
                break
            case 6:
                day = "Saturday"
        }

        return day

    }

}
