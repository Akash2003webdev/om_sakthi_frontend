import emailjs from "@emailjs/browser";

export const sendEnquiryEmail = async ({ name, phone, message, designId }) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) return; // skip if not configured

  return emailjs.send(serviceId, templateId, {
    from_name: name,
    phone_number: phone,
    message: message || "No message",
    design_id: designId || "General",
    reply_to: "noreply@omsakhti.com",
  }, publicKey);
};
