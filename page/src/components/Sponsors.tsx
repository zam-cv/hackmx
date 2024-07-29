import { useEffect, useState } from "react";
import { SERVER } from "@/utils/constants";
import api, { type Sponsor } from "@/utils/api";

export default function SponsorsCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    api.sponsors.list().then(setSponsors);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-start animate-infinite-scroll whitespace-nowrap gap-10" style={{ minWidth: '200%' }}>
        {sponsors.map((sponsor, index) => (
          <img key={index} src={`${SERVER}/${sponsor.image}`} alt={sponsor.name} className="h-16 mx-4 w-auto object-contain" style={{ width: `${100 / sponsors.length}%` }} />
        ))}
        {sponsors.map((sponsor, index) => (
          <img key={`duplicate-${index}`} src={`${SERVER}/${sponsor.image}`} alt={sponsor.name} className="h-16 mx-4 w-auto object-contain" style={{ width: `${100 / sponsors.length}%` }} />
        ))}
      </div>
    </div>
  );
}
