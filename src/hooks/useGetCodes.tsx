import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCodes } from "@/config/https/item";

export const useGetCodes = () => {
    const [codeSettingModal, setCodeSettingModal] = React.useState({});
    const [codeSettingPasaran, setCodeSettingPasaran] = React.useState({});

    const { data: codeModal, isLoading: isLoadingCodeModal } = useQuery({
        queryKey: ["codes", "modalSetting"],
        queryFn: () => getCodes("modal"),
    });

    const { data: codePasaran, isLoading: isLoadingCodePasaran } = useQuery({
        queryKey: ["codes", "pasaranSetting"],
        queryFn: () => getCodes("pasaran"),
    });

    React.useEffect(() => {
        if (codeModal && codePasaran) {
            const numberToLetterMapModal = codeModal?.data?.reduce((acc, setting) => {
                acc[setting.number] = setting.letter;
                return acc;
            }, {});
            const numberToLetterMapPasaran = codePasaran?.data?.reduce((acc, setting) => {
                acc[setting.number] = setting.letter;
                return acc;
            }, {});
            setCodeSettingModal(numberToLetterMapModal);
            setCodeSettingPasaran(numberToLetterMapPasaran);
        }
    }, [codeModal, codePasaran]);

    const getMaskedNumber = (inputNumber, category) => {
        const upperCaseValue = String(inputNumber).toUpperCase();
        let maskedValue = "";
        let i = 0;

        const codeSetting = category === "modal" ? codeSettingModal : codeSettingPasaran;

        while (i < upperCaseValue.length) {
            if (upperCaseValue.slice(i, i + 3) === "000" && codeSetting["000"] !== undefined) {
                maskedValue += codeSetting["000"];
                i += 3;
            } else if (upperCaseValue.slice(i, i + 2) === "00" && codeSetting["00"] !== undefined) {
                maskedValue += codeSetting["00"];
                i += 2;
            } else if (upperCaseValue[i] === "0" && codeSetting["0"] !== undefined) {
                maskedValue += codeSetting["0"];
                i += 1;
            } else {
                maskedValue += codeSetting[upperCaseValue[i]] !== undefined
                    ? codeSetting[upperCaseValue[i]]
                    : upperCaseValue[i];
                i += 1;
            }
        }

        return maskedValue;
    };

    return {
        isLoading: isLoadingCodeModal || isLoadingCodePasaran,
        codeSettingModal,
        codeSettingPasaran,
        getMaskedNumber,
    };
};
