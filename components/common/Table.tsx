import styles from "styles/common/table.module.css";
import Image from 'next/image'
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Arrow from "assets/common/arrow.svg";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomSelect from "../common/Select";
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from "assets/common/delete.svg";

import NextIcon from "assets/common/next.svg";
import LastIcon from "assets/common/last.svg";
import PreviousIcon from "assets/common/prev.svg";
import FirstIcon from "assets/common/first.svg";

const pageSizes = [25, 30, 35, 40, 45, 50];

interface TableProps {
    column: Array<Column>
    checkbox?: boolean
    checked ?: Array<string>
    onCheck?: (id: string, val : boolean) => void
    onResetCheck ?: () => void

    totalItem : number

    onLoad : (page : number, pageSize : number, sortIndex : number | null, otherFilter ?: string) => Promise<Array<Item>>

    headers ?: (
        onLoad : (filter : string) => void
    ) => any

    onClickItem ?: (id : string) => void

    tag ?: TagItem[]
}

export type TagItem = {
    icon : any
    text : string
    onDelete : () => void
}

export type Item = {
    id: string
    items: Array<any>
}

export type Column = {
    text: string
    span?: number
}

const Table: React.FC<TableProps> = (props: TableProps) => {
    const [data, setData] = useState<Array<Item>>([]);
    const [sortIndex, setSortIndex] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>("");
    const [headerCheck, setHeaderCheck] = useState<boolean>(false);

    const load = async (page : number, pageSize : number, sortIndex : number | null, otherFilter ?: string) => {
        setData([]);
        props.onResetCheck?.();
        const _data = await props.onLoad(page, pageSize, sortIndex, otherFilter);
        setData(_data);
    }

    useEffect(()=>{
        load(1, pageSize, sortIndex)
    }, [sortIndex])

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(pageSizes[0]);

    const onPageSizeChange = (event: SelectChangeEvent) => {
        setCurrentPage(1);
        setPageSize((event.target.value as unknown) as number);
        load(1, (event.target.value as unknown) as number, sortIndex, filter);
    };

    const onFirstPage = async () => {
        await load(1, pageSize, sortIndex, filter);
        setCurrentPage(1);
    }

    const onPreviousPage = async () => {
        if (currentPage <= 1) return;
        await load(currentPage-1, pageSize, sortIndex, filter);
        setCurrentPage(prev => prev - 1);
    }

    const totalPage = () : number => {
        return Math.ceil(props.totalItem / pageSize);
    }

    const onNextPage = async () => {
        if (currentPage >= totalPage()) return;
        await load(currentPage+1, pageSize, sortIndex, filter);
        setCurrentPage(prev => prev + 1);
    }

    const onLastPage = async () => {
        await load(totalPage(), pageSize, sortIndex, filter);
        setCurrentPage(totalPage());
    }

    const spanSum =
            props.column.reduce((sum, e) => sum + (e.span ?? 1), 0);

    const onFilterLoad = (filter : string) => {
        setCurrentPage(1);
        setFilter(filter);
        load(1, pageSize, sortIndex, filter);
    }

    const onHeaderCheck = () => {
        if (!headerCheck) {
            data.filter(item=>!props.checked?.includes(item.id)).map(item=>{
                props.onCheck?.(item.id, true)
            })
        }
        else {
            props.onResetCheck?.()
        }
        setHeaderCheck(prev=>!prev)
    }
    
    useEffect(()=>{
        if (data.length <= 0) return
        setHeaderCheck(props.checked?.length===data.length)
    }, [props.checked])

    return (
        <>
            <div className={styles.container}>
                <div className="flex gap-4">
                    {props.headers?.(onFilterLoad)}
                </div>
                <div className="flex gap-4 mt-2.5">
                    {props.tag?.map(tag=>{
                        return <Tag icon={tag.icon} text={tag.text} onDelete={tag.onDelete} />
                    })}
                </div>
                <table className="w-full mt-5">
                    <thead className={styles.header}>
                        <tr >
                            {
                                props.checkbox && 
                                <th className={styles.checkbox}>
                                    <Checkbox
                                        checked={headerCheck}
                                        onChange={onHeaderCheck}
                                    />
                                </th>
                            }
                            {props.column.map((header, key) => {
                                const col = 1;
                                return <th className={styles.tableHeader} key={key}
                                    style={{ width: `${(col / spanSum) * 100}%` }}
                                    onClick={() => {
                                        // if (sortIndex === key) setSortIndex(null);
                                        // else setSortIndex(key);
                                    }}
                                ><div className={styles.tableHeaderText}>
                                        {/* <div className="flex-grow"></div> */}
                                        {header.text}
                                        <div className={`mx-1 my-auto ${sortIndex === key ? styles.flip : ''}`}>
                                            <Image src={Arrow} alt="icon" className="m-auto" width={7} height={7} priority={false} />
                                        </div>
                                        <div className="flex-grow"></div>
                                    </div></th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (() => {
                                let datas = data;
                                return datas.map((data, index) => {
                                    return <tr className={styles.row} key={index}>
                                        {
                                            props.checkbox &&
                                                <td>
                                                    <Checkbox checked={
                                                        props.checked?.includes(data.id)
                                                    }
                                                    onChange={(e) => {
                                                        props.onCheck?.(data.id, !props.checked?.includes(data.id))
                                                    }}
                                                    />
                                                </td>
                                        }
                                        {
                                            data.items.map((item, _index) => {
                                                
                                                return <td style={{ width: `${(1 / spanSum) * 100}%` }} key={_index} onClick={() => {
                                                    props.onClickItem?.(data.id);
                                                }}>{item}</td>
                                            })
                                        }
                                    </tr>
                                })
                            })()
                        }
                    </tbody>
                </table>
                <div className={`${styles.footer} flex`}>
                    <div className="flex-grow"></div>
                    <div className="my-auto mr-3">
                        Rows per page
                    </div>
                    <Box sx={{ minWidth: 75, height: 40 }}>
                        <FormControl fullWidth>
                            <Select
                                id="demo-simple-select"
                                style={{
                                    height: 40
                                }}
                                onChange={onPageSizeChange}
                                value={(pageSize.toString())}
                            >
                                {pageSizes.map((size, index) => {
                                    return <MenuItem value={size} key={index}>{size}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <div className="my-auto mx-3">
                        {(currentPage - 1) * pageSize + 1}-{(currentPage - 1) * pageSize + data.length} of {props.totalItem ?? 0}
                    </div>
                    <div className="my-auto mx-6 cursor-pointer" onClick={onFirstPage}>
                        <Image src={FirstIcon} alt="icon" className="m-auto" width={16} height={16} priority={false} />
                    </div>
                    <div className="my-auto mx-6 cursor-pointer" onClick={onPreviousPage}>
                        <Image src={PreviousIcon} alt="icon" className="m-auto" width={9} height={16} priority={false} />
                    </div>
                    <div className="my-auto mx-6 cursor-pointer" onClick={onNextPage}>
                        <Image src={NextIcon} alt="icon" className="m-auto" width={9} height={16} priority={false} />
                    </div>
                    <div className="my-auto mx-6 cursor-pointer" onClick={onLastPage}>
                        <Image src={LastIcon} alt="icon" className="m-auto" width={16} height={16} priority={false} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Table;

interface TagProps {
    icon: any
    text: string
    onDelete?: () => void
}

const Tag: React.FC<TagProps> = (props: TagProps) => {
    return (
        <>
            <div className={styles.tag}>
                <div className="my-auto">
                    <Image src={props.icon} alt="icon" className="m-auto" width={15} height={15} priority={false} />
                </div>
                <span className={styles.tagText}>
                    {props.text}
                </span>
                <div className="my-auto cursor-pointer" onClick={props.onDelete}>
                    <Image src={DeleteIcon} alt="icon" className="m-auto" width={7} height={7} priority={false} />
                </div>
            </div>
        </>
    )
}