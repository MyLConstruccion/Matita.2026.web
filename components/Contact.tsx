
import React from 'react';

const Contact: React.FC = () => {
  const whatsappNumber = '5493517587003';
  const igHandle = '@libreriamatita';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-matita font-bold text-[#f6a118] drop-shadow-sm">Encuéntranos ✨</h2>
        <p className="text-2xl font-matita text-gray-500 italic">"Nuestra casita de colores te espera en Córdoba"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        <div className="bg-[#fef9eb] rounded-[3.5rem] p-10 shadow-matita space-y-8 border-4 border-white flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-start gap-5">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-orange-50">
                  <svg className="w-8 h-8 text-[#f6a118]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <div>
                  <h4 className="text-2xl font-matita font-bold text-gray-800">Nuestra Casa</h4>
                  <p className="text-xl font-matita text-gray-600">Librería MATITA</p>
                  <p className="text-xl font-matita text-orange-400 font-bold">La Calera, Córdoba, Argentina 📍</p>
               </div>
            </div>

            <div className="flex items-start gap-5">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-pink-50">
                  <svg className="w-8 h-8 text-[#ea7e9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                  <h4 className="text-2xl font-matita font-bold text-gray-800">Horarios</h4>
                  <p className="text-xl font-matita text-gray-600">Lunes a Viernes: 09:00 - 19:00</p>
                  <p className="text-xl font-matita text-gray-600">Sábados: 10:00 - 14:00</p>
               </div>
            </div>

            <div className="flex items-start gap-5">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-yellow-50">
                  <svg className="w-8 h-8 text-[#fadb31]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <div>
                  <h4 className="text-2xl font-matita font-bold text-gray-800">Hablanos</h4>
                  <p className="text-xl font-matita text-gray-600">hola@libreriamatita.com</p>
                  <p className="text-xl font-matita text-[#f6a118] font-bold">+{whatsappNumber}</p>
                  <p className="text-xl font-matita text-[#ea7e9c] font-bold">{igHandle}</p>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/50">
             <a 
               href={`https://wa.me/${whatsappNumber}`} 
               target="_blank" 
               className="w-full block text-center py-5 matita-gradient-orange text-white rounded-[2rem] font-matita text-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
             >
                ¡Escribinos por WhatsApp! 📲
             </a>
          </div>
        </div>

        <div className="h-[500px] md:h-auto bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13627.0195674395!2d-64.33946255!3d-31.350392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d6148383f9801%3A0xc316a7f502473456!2sLa%20Calera%2C%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1710564903209!5m2!1ses-419!2sar" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="grayscale group-hover:grayscale-0 transition-all duration-700"
           ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
