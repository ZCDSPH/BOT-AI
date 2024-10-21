module.exports = {
  description: "What is TOSHAI",
  async run({ api, send, admin }){
    await send({
      attachment: {
        type: "image",
        payload: {
          url: "https://i.ibb.co/fxbKj4d/zcdsph.jpg",
          is_reusable: true
        }
      }
    });
    setTimeout(async () => await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `About ToshiA Chatbot
Meet ToshiA Chatbot, your ultimate virtual assistant! Designed to make your life easier and more productive, ToshiA offers a range of innovative features:

Image Generation: Need a visual for your project? ToshiA can create stunning images tailored to your specifications, helping you bring your ideas to life.

Video Responses: Whether it's a quick tutorial or a detailed explanation for your assignments, ToshiA can send short video clips to ensure you grasp the content effortlessly.

24/7 Availability: ToshiA is always online and ready to assist you, no matter the time of day. Whether you have a late-night question or an early morning task, ToshiA is just a message away.

Personalized Assistance: ToshiA learns from your preferences and adapts to your needs, providing tailored support that makes your tasks more manageable.

User-Friendly Interface: Interacting with ToshiA is a breeze, thanks to an intuitive design that makes navigation simple and enjoyable.

With ToshiA Chatbot by your side, you’ll experience a new level of efficiency and creativity. Say goodbye to stress and hello to seamless assistance!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/p/%F0%9D%90%93%F0%9D%90%8E%F0%9D%90%92%F0%9D%90%87%F0%9D%90%88%F0%9D%90%80-%F0%9D%90%82%F0%9D%90%87%F0%9D%90%80%F0%9D%90%93%F0%9D%90%81%F0%9D%90%8E%F0%9D%90%93-61566991483019/?mibextid=ZbWKwL",
              title: "LIKE AND FOLLOW MY PAGE"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/marjhuncutieee",
              title: "Contact Admin 1"
                }
             ]
        }
      }
    }), 2*1000);
  }
}
