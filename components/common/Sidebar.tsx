import styles from "styles/common/sidebar.module.css";
import Image from 'next/image'
import { useRouter } from "next/router";
import Link from "next/link";

import Supplier from "assets/common/sidebar-icon/unselected/supplier.svg";
import SupplierSelected from "assets/common/sidebar-icon/selected/supplier.svg";
import Self from "assets/common/sidebar-icon/unselected/self.svg";
import SelfSelected from "assets/common/sidebar-icon/selected/self.svg";

import UserGroup from "assets/common/sidebar-icon/unselected/user-group.svg";
import UserAccount from "assets/common/sidebar-icon/unselected/user-account.svg";
import UserGroupSelected from "assets/common/sidebar-icon/selected/user-group.svg";
import UserAccountSelected from "assets/common/sidebar-icon/selected/user-account.svg";
import Subject from "assets/common/sidebar-icon/unselected/subject.svg";
import SubjectSelected from "assets/common/sidebar-icon/selected/subject.svg";
import Category from "assets/common/sidebar-icon/unselected/category.svg";
import CategorySelected from "assets/common/sidebar-icon/selected/category.svg";
import Suppliers from "assets/common/sidebar-icon/unselected/suppliers.svg";
import SuppliersSelected from "assets/common/sidebar-icon/selected/suppliers.svg";
import Branch from "assets/common/sidebar-icon/unselected/branch.svg";
import BranchSelected from "assets/common/sidebar-icon/selected/branch.svg";
import SLAFile from "assets/common/sidebar-icon/unselected/sla-file.svg";
import SLAFileSelected from "assets/common/sidebar-icon/selected/sla-file.svg";


interface SidebarProps {
}

const categories: Array<Category> = [
    {
        title: "ใบสั่งซื้อสินค้า (STO)",
        path: 'sto',
        items: [
            {
                text: "รายการใบสั่งซื้อ",
                icon: Supplier,
                selectedIcon: SupplierSelected,
                number: 5,
                path: 'list'
            },
        ]
    },
]

type Category = {
    title: string
    items: Array<Item>
    path: string
}

type Item = {
    text: string
    icon: any
    selectedIcon?: any
    number: number
    path: string
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {

    return (
        <>
            <div className={`${styles.container} flex flex-col`}>
                {/* <div className={styles.logo}>
                    Fixko
                </div> */}
                {categories.map((category, index) => {
                    return <SidebarCategory separetor={index < categories.length-1} category={category} key={index} />
                })}
            </div>
        </>
    );
};

export default Sidebar;

type SidebarCategoryProps = {
    category: Category
    separetor?: boolean
}

const SidebarCategory: React.FC<SidebarCategoryProps> = (props: SidebarCategoryProps) => {
    return (
        <>
            <div className={styles.item}>
                <div className={styles.itemTitle}>
                    <div className="my-auto">{props.category.title}</div>
                </div>
                {props.category.items.map((item, index) => {
                    return <CategoryItem key={index} item={item} path={'/' + props.category.path + '/' + item.path} />
                })}
            </div>
            {/* {props.separetor &&
                <div className={styles.separetor}></div>
            } */}
        </>
    )
}

type CategoryItemProps = {
    item: Item
    path: string
}

const CategoryItem: React.FC<CategoryItemProps> = (props: CategoryItemProps) => {
    const router = useRouter();
    const isSelected = router.pathname.includes(props.path);
    return (
        <>
            <Link href={props.path}>
                <div className={`${styles.subItem} ${isSelected ? styles.selected : ''}`}>
                    <div className="m-auto">
                        <Image src={isSelected ? (props.item.selectedIcon ?? props.item.icon) : props.item.icon} alt="Logo" width={24} height={24} priority={false} />
                    </div>
                    <div className="m-auto">
                        {props.item.text}
                    </div>
                    <div className="flex-grow">
                    </div>
                    {/* <div className="m-auto">
                        {props.item.number ? props.item.number : ""}
                    </div> */}
                </div>
            </Link>
        </>
    )
}