import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: 'When will I have access to the lectures and assignments?',
    answer:
      'You will have access immediately after enrollment. All materials are available 24/7 for self-paced learning.',
  },
  {
    question: 'What will I get if I subscribe to this program?',
    answer:
      'You will receive a verified certificate upon completion, access to community forums, and lifelong access to course materials.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'Full refund is available within the first 14 days of subscription if you are not satisfied.',
  },
  {
    question: 'Can I switch between plans?',
    answer:
      'Yes, you can upgrade or downgrade your subscription at any time through your account settings.',
  },
];

const ContactSection: React.FC = () => {
  const [open, setOpen] = useState<string>(faqData[0].question);

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <motion.h2
          className="text-5xl font-bold text-center text-gray-800 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Câu hỏi thường gặp
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: FAQ list */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-md">
            <Accordion
              type="single"
              collapsible
              value={open}
              onValueChange={(val) => setOpen(val)}
              className="space-y-6"
            >
              {faqData.map((item, idx) => (
                <AccordionItem key={idx} value={item.question}>
                  <AccordionTrigger className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-6 py-4 text-left text-lg font-medium text-gray-800 focus:outline-none">
                    <span>{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-5 text-gray-600 text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: faqData.length * 0.1 }}
            >
              <button className="inline-flex items-center space-x-2 text-green-600 hover:underline text-base">
                <span>Hiển thị tất cả {faqData.length} câu hỏi thường gặp</span>
                <ChevronDown className="w-6 h-6" />
              </button>
            </motion.div>
          </div>

          {/* Right: Add question box */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex items-center mb-4">
              <ChevronDown className="w-6 h-6 text-gray-500 rotate-[-90deg]" />
              <h3 className="ml-3 text-lg font-medium text-gray-800">Thêm câu hỏi</h3>
            </div>
            <a href="#" className="text-base text-blue-600 hover:underline">
              Truy cập trung tâm trợ giúp dành cho học viên
            </a>
            <div className="border-t border-gray-200 my-5" />
            <p className="text-base text-gray-500">
              Hỗ trợ tài chính có sẵn,&nbsp;
              <a href="#" className="text-blue-600 hover:underline">
                tìm hiểu thêm
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
