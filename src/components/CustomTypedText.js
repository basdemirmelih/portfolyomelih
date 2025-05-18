import React, { useState, useEffect } from 'react';

const CustomTypedText = ({
                             strings,
                             typeSpeed = 150, // Karakter yazma hızı (ms)
                             deleteSpeed = 70, // Karakter silme hızı (ms)
                             delayAfterFull = 2000, // Tamamen yazıldıktan sonra silmeye başlamadan önceki bekleme süresi (ms)
                         }) => {
    // Hook çağrıları bileşenin en başında, koşulsuz
    const [text, setText] = useState('');
    const [stringIndex, setStringIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // strings prop'u yoksa veya boşsa, effect bir şey yapmadan sonlanır.
        if (!strings || strings.length === 0) {
            setText(''); // Güvenlik için metni temizle
            return;
        }

        let typingTimeout; // setTimeout ID'sini tutmak için

        // strings dizisinin dışına taşmayı engellemek için modulo kullanılır.
        const currentFullString = strings[stringIndex % strings.length];

        // currentFullString tanımsızsa (örneğin strings dizisi boşaltılırsa) işlemi durdur.
        if (typeof currentFullString === 'undefined') {
            return;
        }

        if (isDeleting) {
            // Silme Modu
            if (charIndex > 0) {
                typingTimeout = setTimeout(() => {
                    setText(currentFullString.substring(0, charIndex - 1));
                    setCharIndex((prev) => prev - 1);
                }, deleteSpeed);
            } else {
                // Silme bitti, bir sonraki kelimeye geçiş için hazırlan
                typingTimeout = setTimeout(() => {
                    setIsDeleting(false);
                    setStringIndex((prevIndex) => prevIndex + 1); // stringIndex'i artır
                    // charIndex zaten 0, bir sonraki useEffect tetiklemesinde yazma başlayacak
                }, typeSpeed); // Bir sonraki kelimeye geçmeden önce kısa bir bekleme
            }
        } else {
            // Yazma Modu
            if (charIndex < currentFullString.length) {
                typingTimeout = setTimeout(() => {
                    setText(currentFullString.substring(0, charIndex + 1));
                    setCharIndex((prev) => prev + 1);
                }, typeSpeed);
            } else {
                // Kelime tamamen yazıldı, silme moduna geçmeden önce bekle
                typingTimeout = setTimeout(() => {
                    setIsDeleting(true);
                }, delayAfterFull);
            }
        }

        // Component unmount olduğunda veya bu effect yeniden çalışmadan önce
        // mevcut zamanlayıcıyı temizle.
        return () => clearTimeout(typingTimeout);
    }, [
        charIndex,
        stringIndex,
        isDeleting,
        strings,
        typeSpeed,
        deleteSpeed,
        delayAfterFull,
    ]);

    // Eğer strings prop'u başlangıçta yoksa veya boşsa, render edilecek JSX
    // Bu kontrol, Hook'lar çağrıldıktan sonra yapılır ve Rules of Hooks'a uygundur.
    if (!strings || strings.length === 0) {
        // console.warn("CustomTypedText: 'strings' prop eksik veya boş."); // Bu uyarıyı isterseniz açabilirsiniz
        return <span id="typed-text"></span>; // ID'yi stil tutarlılığı için ekleyebiliriz
    }

    return (
        <span id="typed-text">
      {text}
            <span className="typed-cursor">|</span> {/* CSS ile stilize edilecek imleç */}
    </span>
    );
};

export default CustomTypedText;