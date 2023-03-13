import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../../styles/sto/detail.module.css'
import Sidebar from '../../../../components/common/Sidebar'
import NavBar from '../../../../components/common/NavBar'
import Button from '../../../../components/common/Buttont'

import { GetServerSideProps, NextPage } from 'next'
import { AuthPayload } from '../../../../models/Authentication'
import { Verify } from '../../../../services/Authentication'
import { EditPayload, STODetail } from '../../../../models/STO'
import { Edit, GetSTODetail } from '../../../../services/STO'
import { useRouter } from 'next/router'
import Card from '../../../../components/common/Card'
import Link from 'next/link'
import { useState } from 'react'


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
    const router = useRouter();
    const [
        quantity, setQuantity
    ] = useState<{productId : number, newQuantity : number}[]>(props.sto.orderedProducts.map(e=>{
        return {
            productId : e.product.id,
            newQuantity : e.quantity * e.product.correspondingQuantity
        }
    }));
    const onSubmit = async () => {
        if (
            !note
        ) return;
        const req : EditPayload = {
            note : note,
            items : quantity.map(item=>{
                const original = props.sto.orderedProducts.find(e=>e.product.id===item.productId)!
                const originalUOM = original.quantity * original.product.correspondingQuantity
                const adjustRatio = item.newQuantity / originalUOM
                const newUOP = original.quantity * adjustRatio
                return {
                    productId : item.productId,
                    newQuantity : newUOP
                }
            })
        }
        try  {
            await Edit(props.auth.token, router.query.id as string, req);
            router.replace(`/sto/list/${router.query.id}`)
        } catch (err) {
            console.error(err)
        }
    }
    const [note, setNote] = useState<string>("");
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
                            <div className='flex-grow'></div>
                            <Link href={`/sto/list/${router.query.id}`}>
                                <Button text="ยกเลิก" backgroundColor='#FFDAD8' textColor='#AF212E' />
                            </Link>
                            <Button text="บันทึก" backgroundColor='#64CA77' textColor='#FFFFFF' onClick={onSubmit} />
                        </div>

                        <div className={styles.container}>
                            <div className="w-full">
                                <Card>
                                <div className={styles.cardTitle}>Note</div>
                                <div className='mt-3'></div>
                                <input className={styles.input} onChange={(e) => {
                                    setNote(e.target.value)
                                }} style={{width:'80%'}} placeholder="Note"></input>
                                </Card>
                                <div className='mt-4'></div>
                                <Card>
                                    <div className={styles.cardTitle}>แก้ไขรายการสินค้า</div>
                                    {
                                        props.sto.orderedProducts.map((prod, index) => {
                                            return <>
                                                <div className={styles.itemContainer} key={index}>
                                                    <div className={styles.itemTitle}>
                                                        {prod.product.description}
                                                    </div>
                                                    <CardItem text="หน่วย" value={prod.product.uom} />
                                                    <CardInputItem onChange={(val) => {
                                                        setQuantity(prev => {
                                                            let temp = [...prev];
                                                            temp[index].newQuantity = val;
                                                            return temp;
                                                        })
                                                    }} text="จำนวน" defaultValue={(prod.quantity * prod.product.correspondingQuantity)} />
                                                </div>
                                                {props.sto.orderedProducts.length - 1 !== index && <div className={styles.seperator}></div>}
                                            </>
                                        })
                                    }
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
interface CardInputItemProps {
    text: string
    onChange: (val: number) => void
    defaultValue: number
}

const CardInputItem: React.FC<CardInputItemProps> = (props: CardInputItemProps) => {
    return (
        <>
            <div className="w-full flex my-3">
                <div className={`w-1/3 mt-3 ${styles.text}`}>
                    {props.text}
                </div>
                <div className="flex-grow">
                    <input className={styles.input} onChange={(e) => {
                        props.onChange(parseFloat(e.target.value))
                    }} type="number" defaultValue={props.defaultValue} min={0}></input>
                </div>
            </div>
        </>
    )
}