import Head from 'next/head'
import styles from '../../../styles/sto/index.module.css'
import Sidebar from '../../../components/common/Sidebar'
import NavBar from '../../../components/common/NavBar'
import Button from '../../../components/common/Buttont'
import ExportIcon from "assets/common/export.svg";
import ExcelIcon from "assets/common/excel.svg";
import PDFIcon from "assets/common/pdf.svg";
import { useEffect, useState } from 'react'

import Radio from '@mui/material/Radio';
import { GetServerSideProps, NextPage } from 'next'
import { AuthPayload } from '../../../models/Authentication'
import { Verify } from '../../../services/Authentication'
import { GetAllBranches } from '../../../services/Branch'
import { formatDate } from '../../../utils/Date'
import { useRouter } from 'next/router'
import Table, { Item } from '../../../components/common/Table'
import Input from '../../../components/common/Input'
import CustomSelect from '../../../components/common/Select'
import { BranchList } from '../../../models/Branch'
import { GetStatuses, GetSTOList } from '../../../services/STO'
import { STO, STOListPayload } from '../../../models/STO'
import moment from 'moment'
import DateRange from '../../../components/common/DateRange'


export type Repairs = {
    repairId: string;
    createAt: string;
    branch: string;
    category: string;
    subject: string;
    slaType: string;
    slaColor: string;
    slaDuration: string;
    slaDurationUnit: string;
    status: string;
}

const tableColumn = [
    {
        text: "หมายเลขคำสั่งซื้อ",
    },
    {
        text: "วันที่สั่ง",
    },
    {
        text: "สาขา",
    },
    {
        text: "สถานะ",
    },
]

export const getServerSideProps: GetServerSideProps = async (context) => {
    let auth: AuthPayload;
    try {
        auth = await Verify(context);
    } catch (err) {
        console.error(err)
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }
    let branches: BranchList[]
    try {
        branches = await GetAllBranches(auth.token);
    } catch (err) {
        console.error(err)
        return {
            redirect: {
                destination: '/error',
                permanent: true,
            }
        }
    }
    let statuses : string[]
    try {
        statuses = await GetStatuses(auth.token);
    } catch (err) {
        console.error(err)
        return {
            redirect: {
                destination: '/error',
                permanent: true,
            }
        }
    }
    return {
        props: {
            auth: auth,
            branches: branches,
            statuses : statuses
        }
    }
}
interface HomeProps {
    auth: AuthPayload
    branches: BranchList[]
    statuses: string[]
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
    const [showExport, setShowExport] = useState<boolean>(false);

    const [exportMode, setExportMode] = useState<"selected" | "all" | null>(null);

    const [selected, setSelected] = useState<Array<string>>([]);

    const [branch, setBranch] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);

    const router = useRouter();

    const getAllRepairIds = async () : Promise<Array<string>> => {
        // const repairs = await GetAllSelfRepairs(props.auth.token);
        // return repairs.repairs.map((repair) => repair.repairId)
        return [];
    }

    const exportPDF = async () => {
        if (exportMode === null) return;
        let selectedIds: string;
        if (exportMode === 'all') selectedIds = (await getAllRepairIds()).join(',')
        else selectedIds = selected.join(',');
        router.push('/repairs/self-repairs/export?id=' + selectedIds)
    }

    const exportExcel = async () => {
        if (exportMode === null) return;
        setShowExport(false);
        let selectedIds: string;
        if (exportMode === 'all') selectedIds = (await getAllRepairIds()).join(',')
        else selectedIds = selected.join(',');
        router.push(process.env.API_BASE_URL + '/api/v1/admin/repairs/export/repair?id=' + selectedIds)
    }

    useEffect(() => {
        try {
            if (window) {
                window.onclick = function (event) {
                    if ((event.target as any).id === "myModal") setShowExport(false);
                }
            }
        } catch {

        }
    }, [])

    const [totalItem, setTotalItem] = useState<number>(0);

    const loadData = async (page: number, pageSize: number, sortBy?: string, otherFilter?: string): Promise<Array<STO>> => {
        let sto: STOListPayload;
        try {
            sto = await GetSTOList(props.auth.token, page, pageSize, sortBy, otherFilter);
        } catch (err) {
            console.error(err)
            return []
        }
        setTotalItem(sto.total);
        return sto.items
    }

    const onLoad = async (page: number, pageSize: number, sortIndex: number | null, otherFilter?: string): Promise<Array<Item>> => {
        const data = await loadData(page, pageSize, sortIndex ? tableColumn[sortIndex].text : undefined, otherFilter);
        return data.map((sto, index) => {
            return {
                id: sto.id.toString(),
                items: [
                    sto.id.toString(),
                    formatDate(sto.createdAt),
                    sto.branch,
                    sto.status,
                ]
            }
        })
    }

    const tableFilter = (startDate: string | null, endDate: string | null, branch: string | null, status : string | null): string => {
        let filter = ``
        if (startDate) filter += `&startDate=${startDate}`
        if (endDate) filter += `&endDate=${endDate}`
        if (status) filter += `&status=${status}`
        if (branch) filter += `&branchId=${branch}`
        return filter
    }

    return (
        <>
            <Head>
                <title>Fixko CMS</title>
                <link rel="icon" href="/icon.svg" />

                <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet" />
            </Head>
            <div className='min-h-screen flex flex-col'>
                <NavBar profile={props.auth.profile} />
                <div className='flex-grow flex bg-bg min-h-full min-w-screen'>
                    <Sidebar />
                    <div className='content flex-grow'>
                        <div className='title flex'>
                            <div>
                            รายการใบสั่งซื้อสินค้า (STOs)
                            </div>
                        </div>
                        <div>
                            <Table
                                onLoad={onLoad}
                                totalItem={totalItem}
                                column={tableColumn}
                                headers={(onLoad) => {
                                    return <div className="flex gap-4 w-full">
                                        <div className="flex-grow"></div>
                                        <DateRange onChange={(startDate, endDate) => {
                                            setStartDate(startDate);
                                            setEndDate(endDate);
                                            onLoad(tableFilter(startDate.toISOString(), endDate.toISOString(), branch, status));
                                        }} />
                                        <CustomSelect placeHolder="สาขา" width={150} items={props.branches.map((val, index) => {
                                            return {
                                                value: val.id,
                                                text: val.name
                                            }
                                        })}
                                            onChange={(val) => {
                                                setBranch(val)
                                                onLoad(tableFilter(startDate ? startDate.toISOString() : null, endDate ? endDate.toISOString() : null, val, status));
                                            }}
                                        />
                                        <CustomSelect placeHolder="สถานะ" width={150} items={props.statuses.map((val, index) => {
                                            return {
                                                value: val,
                                                text: val
                                            }
                                        })}
                                            onChange={(val) => {
                                                setStatus(val)
                                                onLoad(tableFilter(startDate ? startDate.toISOString() : null, endDate ? endDate.toISOString() : null, branch, val));
                                            }}
                                        />
                                    </div>
                                }}
                                onClickItem={(id: string) => {
                                    router.push(`/sto/list/${id}`)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showExport &&
                <div>
                    <div id="myModal" className="modal">
                        <div className="modal-content">
                            <div className="modal-title">Export</div>
                            <div className={styles.modalContent}>
                                <div className={`${styles.export} m-auto my-6 gap-3`}>
                                    <div className={`m-auto ${exportMode === "selected" ? '' : styles.disabled}`}>
                                        ส่งออกรายการที่เลือกไว้
                                    </div>
                                    <div className='flex-grow'></div>
                                    <div className={`${styles.count} m-auto`}>
                                        {selected.length}
                                    </div>
                                    <Radio checked={exportMode === "selected"} onClick={() => {
                                        setExportMode("selected");
                                    }} />
                                </div>
                                <div className={`${styles.export} m-auto my-6 gap-3`}>
                                    <div className={`m-auto ${exportMode === "all" ? '' : styles.disabled}`}>
                                        ส่งออกรายการทั้งหมด
                                    </div>
                                    <div className='flex-grow'></div>
                                    <div className={`${styles.count} m-auto`}>
                                        {totalItem}
                                    </div>
                                    <Radio checked={exportMode === "all"} onClick={() => {
                                        setExportMode("all");
                                    }} />
                                </div>
                            </div>
                            <div className={styles.footer}>
                                <Button icon={ExcelIcon} onClick={exportExcel} className="flex-grow" text="Export Excel" backgroundColor='#AF212E' textColor='white' />
                                <Button icon={PDFIcon} onClick={exportPDF} className="flex-grow" text="Export PDF" backgroundColor='#AF212E' textColor='white' />
                            </div>
                        </div>

                    </div>
                </div>
            }
        </>
    )
}
export default Home
