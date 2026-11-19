/* eslint-disable no-restricted-globals */
// Şekil noktaları ayrı bir iş parçacığında hazırlanır: 3B model oluşturma ve binlerce noktanın
// örneklenmesi telefonda yüzlerce milisaniye sürebiliyor; ana iş parçacığında yapılınca kaydırma donuyordu.
// Gelen: { adet, isler: [{ i, u }] }  (i: sahnedeki sıra, u: SEKIL_URETICILERI içindeki üretici)
// Giden: her şekil için { i, konum, normal } (diziler kopyalanmadan aktarılır)
import { SEKIL_URETICILERI, ornekle } from '../../three/sekiller';

self.onmessage = ({ data }) => {
    const { adet, isler } = data;
    isler.forEach(({ i, u }) => {
        const s = ornekle(SEKIL_URETICILERI[u], adet);
        self.postMessage({ i, konum: s.konum, normal: s.normal }, [s.konum.buffer, s.normal.buffer]);
    });
};
