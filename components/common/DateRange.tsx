import styles from "styles/common/date-range.module.css";
import Image from 'next/image'
import BranchIcon from "assets/common/branch.svg";
import DeleteIcon from "assets/common/delete.svg";
import CalendarIcon from "assets/common/calendar.svg";
import SLAIcon from "assets/common/sla.svg";
import SubjectIcon from "assets/common/subject.svg";
import Arrow from "assets/common/arrow.svg";
import Input from "./Input";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import CustomSelect from "./Select";
import Checkbox from '@mui/material/Checkbox';

import NextIcon from "assets/common/next.svg";
import LastIcon from "assets/common/last.svg";
import PreviousIcon from "assets/common/prev.svg";
import FirstIcon from "assets/common/first.svg";
import { useEffect, useRef, useState } from "react";

import DropdownIcon from "assets/common/dropdown.svg";
import { v4 as uuidv4 } from 'uuid';

import DateRangePicker from 'react-bootstrap-daterangepicker';
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment, { Moment } from "moment";
import { InputLabel } from "@mui/material";
import { formatDate } from "../../utils/Date";

interface DateRangeProps {
    onChange : (startDate : moment.Moment, endDate : moment.Moment) => void
}

const DateRange: React.FC<DateRangeProps> = (props: DateRangeProps) => {
    const btn = useRef(null);


    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);

    const handleChange = (startDate : moment.Moment, endDate : moment.Moment) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }
    
    return (
        <>
        <DateRangePicker
            onApply={(e, picker) => {
                props.onChange(picker.startDate as moment.Moment, picker.endDate as moment.Moment)
                handleChange(picker.startDate as moment.Moment, picker.endDate as moment.Moment)
            }}
        >
            <button className={styles.btn} ref={btn}>
                <div className="flex w-full">
                {/* {
                    startDate && endDate ? <div className={styles.date}>
                        {formatDate(startDate.toISOString())}
                        -
                        {formatDate(endDate.toISOString())}
                    </div> : "วันที่"
                } */}
                วันที่
                <div className="flex-grow"></div>
                <Image src={DropdownIcon} alt="Select" className="mr-4" width={10} height={6} priority={false} />
                </div>
            </button>
        </DateRangePicker>
        </>
    );
};

export default DateRange;