import { useEffect, useState } from "react";
import api, { type Image } from "@/utils/api";
import { SERVER } from "@/utils/constants";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function Gallery() {
  const [galeries, setGaleries] = useState<[string, Image[]][]>([]);

  useEffect(() => {
    api.gallery.getImages().then(setGaleries);
  }, []);

  return galeries.map((gallery, i) => (
    <div key={i} className="pb-10">
      <h1 className="text-center pb-10 text-3xl text-gray-400 font-bold">
        {gallery[0]}
      </h1>
      <div className="px-10 max-[500px]:px-5">
        <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1, 350: 2, 750: 2, 800: 3, 900: 4 }}>
          <Masonry gutter="20px">
            {gallery[1].map((image, i) => (
              <img
                key={i}
                src={`${SERVER}/${image.name}`}
                alt={image.name}
                loading="lazy"
                className="w-full object-cover"
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  ));
}
