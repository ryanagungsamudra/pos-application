import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import IconSearch from "@/assets/icons/search.svg";
import IconTrash from "@/assets/icons/trash-white.svg";

function OrderPanel() {
  return (
    <div className="flex gap-5 mt-[10px]">
      <div className="flex flex-col gap-[11px]">
        {/* Vustomer */}
        <div className="w-[418px] h-[44px] rounded-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
          <p className="text-[20px] font-semibold text-white">Customer</p>
          <div className="flex items-center border-[0.3px] border-[#000] rounded-[10px] w-[84px] h-[29px]">
            <p className="text-[16px] font-medium py-[5px] px-[12px]">
              Reguler
            </p>
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <div className="w-[418px] h-[44px] rounded-tl-[10px] rounded-tr-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
            <p className="text-[20px] font-semibold text-white">Keterangan</p>
          </div>
          <div className="w-[418px] rounded-bl-[10px] rounded-br-[10px] drop-shadow-lg bg-white p-[12px]">
            <p className="text-[20px]">
              Lorem ipsum dolor sit amet consectetur. Augue gravida pretium vel
              non aliquam.
            </p>
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div>
        <div className="w-[418px] h-[44px] rounded-tl-[10px] rounded-tr-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
          <p className="text-[20px] font-semibold text-white">
            Metode Pembayaran
          </p>
        </div>
        <div className="w-[418px] rounded-bl-[10px] rounded-br-[10px] drop-shadow-lg bg-white p-[12px]">
          <RadioGroup defaultValue="option-one" className="flex gap-[12px]">
            <div className="flex justify-center items-center space-x-2 w-[104px] h-[60px] border-[1.1px] border-solid border-[#D1D3D5] rounded-[10px]">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one" className="text-[18px]">
                Cash
              </Label>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[104px] h-[60px] border-[1.1px] border-solid border-[#D1D3D5] rounded-[10px] px-16">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two" className="text-[18px]">
                Transfer
              </Label>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[104px] h-[60px] border-[1.1px] border-solid border-[#D1D3D5] rounded-[10px] px-16">
              <RadioGroupItem value="option-three" id="option-two" />
              <div>
                <Label htmlFor="option-two" className="text-[18px]">
                  Bon
                </Label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className="w-[34px] h-[18px] border-[0.4px] border-solid border-black"
                  />
                  <p>Hari</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Toggle search & delete all */}
      <div className="w-[17%] flex justify-center">
        <div className="flex flex-col gap-[18px]">
          <div>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#D9D9D9] rounded-full">
              <img
                src={IconSearch}
                alt="Icon Search"
                className="w-[30px] h-[30px] cursor-pointer"
              />
            </div>
            <p className="text-[16px] font-medium">Cari Item</p>
          </div>
          <div>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#D9D9D9] rounded-full">
              <img
                src={IconTrash}
                alt="Icon Trash"
                className="w-[30px] h-[30px] cursor-pointer"
              />
            </div>
            <p className="text-[16px] font-medium">Delete all</p>
          </div>
        </div>
      </div>

      {/* Checkout */}
      <div className="w-full">
        <div className="w-full h-140px drop-shadow-lg bg-white rounded-tr-[10px] rounded-tl-[10px] p-4">
          <div className="flex w-full justify-between">
            <p className="text-[26px] font-semibold">Total</p>
            <p className="text-[26px] font-semibold">Rp 100.000.000</p>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-[20px] font-normal">Uang</p>
            <div className="flex gap-2">
              <p className="text-[20px] font-normal">Rp</p>
              <input
                type="text"
                className="text-[20px] w-[100px] font-normal border-[0.4px] border-solid border-black"
              />
            </div>
          </div>
          <div className="-mx-4 mt-2">
            <hr className="border-[#CFD1D3] border-1.2" />
          </div>
          <div className="flex w-full justify-between">
            <p className="text-[20px] font-normal">Kembalian</p>
            <p className="text-[20px] font-normal">Rp 40.000</p>
          </div>
        </div>
        <div className="w-full h-[54px] bg-secondary-gradient flex items-center justify-center rounded-bl-[10px] rounded-br-[10px]">
          <p className="text-[20px] font-bold text-white">Checkout</p>
        </div>
      </div>
    </div>
  );
}

export default OrderPanel;
