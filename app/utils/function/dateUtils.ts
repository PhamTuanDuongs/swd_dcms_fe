import dayjs from "dayjs";

export const getMondayOfWeek = (weekDay: Date) => {
    return dayjs(weekDay).day(1).toDate();
};

export const getAllMondayOfYear = (year: number): Date[] => {
    const mondays: Date[] = [];

    let mondayOfMonth = dayjs().year(year).month(1).date(1).day(1);

    while (mondayOfMonth.year() == year) {
        mondays.push(mondayOfMonth.toDate());
        mondayOfMonth = mondayOfMonth.add(7, "day");
    }

    return mondays;
};

export const formatDate = (inputDate: string) => {
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
    return formattedDate;
};
