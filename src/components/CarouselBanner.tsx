// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import sample1 from "@/assets/sample1.jpg";
import sample2 from "@/assets/sample2.jpg";
import sample3 from "@/assets/sample3.jpg";

function CarouselBanner() {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: false,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper">
        <SwiperSlide>
          <img src={sample1} className="w-full rounded-xl" alt="sample1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={sample2} className="w-full rounded-xl" alt="sample2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={sample3} className="w-full rounded-xl" alt="sample3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default CarouselBanner;
