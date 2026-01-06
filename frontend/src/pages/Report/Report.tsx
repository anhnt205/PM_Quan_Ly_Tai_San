import {useEffect, useState} from 'react';

export default function Report(){
    const getTypeInfo = (typeValue: any) => {
        switch (Number(typeValue)) {
            case 1:
                return {
                    title: "Báo cáo S22-DN",
                    label: "S22-DN",
                };
            case 2:
                return {
                    title: "Biên bản kiểm kê",
                    label: "Kiểm kê",
                };
            case 3:
                return {
                    title: "Báo cáo 05-TSCD-24-2017-TT-BTC",
                    label: "05-TSCD-24-2017-TT-BTC",
                };
            case 4:
                return {
                    title: "Mẫu số-01",
                    label: "Mẫu số-01",
                };
            case 5:
                return {
                    title: "Mẫu số-21",
                    label: "Mẫu số-21",
                };
            default:
                return {
                    title: "Báo cáo S22-DN",
                    label: "S22-DN",
                };
        }
    }
}