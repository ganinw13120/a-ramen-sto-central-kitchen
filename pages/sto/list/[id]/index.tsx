import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../../styles/sto/detail.module.css'
import Sidebar from '../../../../components/common/Sidebar'
import NavBar from '../../../../components/common/NavBar'
import Button from '../../../../components/common/Buttont'
import ExportIcon from "assets/repairs/export.svg";
import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { AuthPayload } from '../../../../models/Authentication'
import { Verify } from '../../../../services/Authentication'
import { STODetail } from '../../../../models/STO'
import { Approve, GetPDF, GetSTODetail, Reject } from '../../../../services/STO'
import { useRouter } from 'next/router'
import Card from '../../../../components/common/Card'
import { formatDateTime } from '../../../../utils/Date'
import Link from 'next/link'
import DeleteModal from '../../../../components/common/Modal'

import CrossIcon from "assets/common/cross.svg";
import TickIcon from "assets/common/tick.svg";

const editableStatus = [
    "Sent",
    "Edited"
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
    let sto: STODetail
    try {
        const id = context.params!.id;
        sto = await GetSTODetail(auth.token, id as string);
    } catch (err) {
        console.error(err)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    return {
        props: {
            auth: auth,
            sto: sto,
        }
    }
}

interface HomeProps {
    auth: AuthPayload
    sto: STODetail
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
    const [modal, setModal] = useState<"Approve" | "Reject" | null>(null);
    const router = useRouter();
    const onApprove = async () => {
        try {
            await Approve(props.auth.token, router.query.id as string);
            router.reload();
        } catch (err) {
            console.error(err);
        }
    }
    const onReject = async () => {
        try {
            await Reject(props.auth.token, router.query.id as string);
            router.reload();
        } catch (err) {
            console.error(err);
        }
    }
    const onExport = async () => {
        try {
            const res = await GetPDF(props.auth.token, router.query.id as string);
        } catch (err) {
            console.error(err);
        }
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
                        <div className={styles.preTitle}>
                            รายการใบสั่งซื้อ
                        </div>
                        <div className={styles.title}>
                            {router.query.id} - {props.sto.branchName}
                            {/* {props.sto.} - {props.repair.repairSelfDetail.category}/{props.repair.repairSelfDetail.subject} - {props.repair.repairSelfDetail.branchName} */}
                            <div className='flex-grow'></div>
                            <Button text="Export PDF" backgroundColor='#FFDAD8' textColor='#AF212E' icon={ExportIcon} onClick={onExport}/>
                            {
                                editableStatus.includes(props.sto.tracking[props.sto.tracking.length - 1].status) && <>
                                    <Link href={`/sto/list/${router.query.id}/edit`}>
                                        <Button text="แก้ไข" backgroundColor='#FFBA53' textColor='#FFFFFF' />
                                    </Link>
                                    <Button text="ปฏิเสธ" backgroundColor='#FFDAD8' textColor='#AF212E' onClick={() => {
                                        setModal("Reject")
                                    }} />
                                    <Button text="อนุมัติ" backgroundColor='#64CA77' textColor='#FFFFFF' onClick={() => {
                                        setModal("Approve")
                                    }} />
                                </>
                            }
                        </div>

                        <div className={styles.container}>
                            <div className="w-2/3">
                                <Card>
                                    <CardItem text="เลขที่ใบสั่งซื้อ" value={router.query.id as string} />
                                    <CardItem text="สาขา" value={props.sto.branchName} />
                                    <CardItem text="สถานะ" value={props.sto.tracking[props.sto.tracking.length - 1].status} />
                                </Card>
                                <div className='mt-4'></div>
                                <Card>
                                    <div className={styles.cardTitle}>สินค้าที่สั่งจากสาขา</div>
                                    {
                                        props.sto.orderedProducts.map((prod, index) => {
                                            return <>
                                                <div className={styles.itemContainer} key={index}>
                                                    <div className={styles.itemTitle}>
                                                        {prod.product.description}
                                                    </div>
                                                    <CardItem text="หน่วย" value={prod.product.uop} />
                                                    <CardItem text="จำนวน" value={prod.quantity.toFixed(2)} />
                                                </div>
                                                {props.sto.orderedProducts.length - 1 !== index && <div className={styles.seperator}></div>}
                                            </>
                                        })
                                    }
                                </Card>
                                <div className='mt-4'></div>
                                <Card>
                                    <div className={styles.cardTitle}>รวมวัตถุดิบ</div>
                                    {
                                        props.sto.orderedProducts.map((prod, index) => {
                                            return <>
                                                <div className={styles.itemContainer} key={index}>
                                                    <div className={styles.itemTitle}>
                                                        {prod.product.description}
                                                    </div>
                                                    <CardItem text="หน่วย" value={prod.product.uom} />
                                                    <CardItem text="จำนวน" value={(prod.quantity * prod.product.correspondingQuantity).toFixed(2)} />
                                                </div>
                                                {props.sto.orderedProducts.length - 1 !== index && <div className={styles.seperator}></div>}
                                            </>
                                        })
                                    }
                                </Card>
                            </div>
                            <div className="w-1/3">
                                <Card>
                                    <div className="w-full flex">
                                        <div className={`w-2/4 ${styles.text}`}>
                                            วันที่สร้าง
                                        </div>
                                        <div className="flex-grow text-sm">
                                            {formatDateTime(props.sto.createdAt)}
                                        </div>
                                    </div>
                                </Card>
                                <div className="mt-4"></div>
                                <Card>
                                    <div className="w-full flex">
                                        <div className={`w-2/4 ${styles.statusTitle}`}>
                                            สถานะล่าสุด
                                        </div>
                                    </div>

                                    <div className="w-full flex my-5">
                                        <div className={`w-3/4 ${styles.statusLastestTime}`}>
                                            {formatDateTime(props.sto.tracking[props.sto.tracking.length - 1].editedAt)}
                                        </div>
                                        <div className={`${styles.statusLastest} flex-grow`} style={{ color: "#64CA77" }}>
                                            {props.sto.tracking[props.sto.tracking.length - 1].status}
                                        </div>
                                    </div>
                                    {props.sto.tracking.map((status, index) => {
                                        return <div className="w-full flex mt-3" key={index}>
                                            <div className={`w-3/4 ${styles.statusTime}`}>
                                                {formatDateTime(status.editedAt)}
                                            </div>
                                            <div className={`${styles.statusText} flex-grow`}>
                                                {status.status}
                                            </div>
                                        </div>
                                    })}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                modal && <DeleteModal
                    action={`${modal === "Reject" ? "ปฏิเสธ" : "อนุมัติ"}`}
                    text={`${router.query.id}`}
                    color={`${modal === "Reject" ? "FFDAD8" : "64CA77"}`}
                    fontColor={`${modal === "Reject" ? "AF212E" : "FFFFFF"}`}
                    titleColor={`${modal === "Reject" ? "AF212E" : "64CA77"}`}
                    onClose={() => setModal(null)}
                    icon={modal === "Reject" ? CrossIcon : TickIcon}
                    onSubmit={() => {
                        switch (modal) {
                            case "Approve":
                                onApprove()
                                break
                            case "Reject":
                                onReject()
                                break
                        }
                    }}
                />
            }
        </>
    )
}
export default Home

interface CardItemProps {
    text: string
    value: string
}

const CardItem: React.FC<CardItemProps> = (props: CardItemProps) => {
    return (
        <>
            <div className="w-full flex my-3">
                <div className={`w-1/3 ${styles.text}`}>
                    {props.text}
                </div>
                <div className="flex-grow">
                    {props.value}
                </div>
            </div>
        </>
    )
}