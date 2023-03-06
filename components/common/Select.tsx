import Image from 'next/image'
import DropdownIcon from "assets/common/dropdown.svg";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react";
import Box from '@mui/material/Box';

import { v4 as uuidv4 } from 'uuid';

export type Item = {
    value : any
    text : string
}

interface SelectProps {
    width: number
    placeHolder : string
    items : Array<Item>
    onChange ?: (val : any) => void

}

const CustomSelect: React.FC<SelectProps> = (props: SelectProps) => {

    const id = uuidv4()

    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        props.onChange?.(event.target.value);
        setAge(event.target.value as string);
    };
    return (
        <>
            <Box sx={{ width: props.width, height: 48 }}>
                <FormControl fullWidth>
                    <InputLabel id={id} className="roboto" style={{
                        paddingLeft: '10px',
                        marginTop : '-4px'
                    }}>{props.placeHolder}</InputLabel>
                    <Select
                        labelId={id}
                        style={{
                            borderRadius: '100px',
                            paddingLeft: '10px',
                            height : 48
                        }}
                        id={id}
                        value={age}
                        fullWidth
                        label={`${props.placeHolder}`}
                        onChange={handleChange}
                        IconComponent={() => (
                            <Image src={DropdownIcon} alt="Select" className="mr-4" width={30} height={15} priority={false} />
                        )}
                    >
                        {
                            props.items.map((item, index) => {
                                return <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default CustomSelect;