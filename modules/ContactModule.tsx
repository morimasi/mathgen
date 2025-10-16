import React, { useState } from 'react';
import TextInput from '../components/form/TextInput';
import Button from '../components/form/Button';
import { XIcon, InstagramIcon } from '../components/icons/Icons';

const ContactModule: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const recipient = 'morimasi@gmail.com';
        const subject = encodeURIComponent('MathGen Uygulaması Geri Bildirimi');
        const body = encodeURIComponent(
`Ad: ${formData.name}
E-posta: ${formData.email}

Mesaj:
${formData.message}`
        );

        // This will open the user's default email client
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="space-y-6">
            <p className="text-stone-600 dark:text-stone-400">
                Uygulama ile ilgili her türlü soru, öneri veya geri bildiriminiz için bizimle iletişime geçebilirsiniz. Gelişimimize katkıda bulunduğunuz için teşekkür ederiz.
            </p>

            <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
                <div>
                    <p className="font-semibold">Uygulama Geliştiricisi</p>
                    <p className="text-stone-600 dark:text-stone-400">E-posta: <a href="mailto:morimasi@gmail.com" className="text-orange-700 dark:text-orange-500 hover:underline">morimasi@gmail.com</a></p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-stone-200 dark:border-stone-700">
                    <a href="https://x.com/bbmaltunel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors">
                        <XIcon className="w-5 h-5" />
                        <span>@bbmaltunel</span>
                    </a>
                    <a href="https://instagram.com/barismutlualtunel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors">
                        <InstagramIcon className="w-5 h-5" />
                        <span>@barismutlualtunel</span>
                    </a>
                </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700 space-y-2 text-center">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Dijital Eğitim Materyali Projeleriniz İçin
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                    Belirlediğiniz bir alanda, istediğiniz mantıklı işlevlere sahip özgür, güvenli ve eğitsel dijital ürün çözümleri için lütfen iletişime geçiniz.
                </p>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold">İletişim Formu</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 -mt-2">
                    Bu form, bilgisayarınızdaki varsayılan e-posta uygulamasını açacaktır.
                </p>
                <TextInput
                    label="Adınız"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınız ve soyadınız"
                />
                <TextInput
                    label="E-posta Adresiniz"
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="size-ulasabilecegimiz@eposta.com"
                />
                <div>
                    <label htmlFor="contact-message" className="font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5 block">Mesajınız</label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Soru, öneri veya geri bildiriminizi buraya yazın..."
                        className="block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 sm:text-sm"
                    />
                </div>
                <Button type="submit" className="w-full">E-posta Olarak Gönder</Button>
            </form>
        </div>
    );
};

export default ContactModule;