import Link from "next/link";

const cookiesType = [
  {
    title: "Account-Related Cookies",
    des: "When you create an account with us, we use cookies to manage the signup process and general administration. These cookies are typically deleted upon logging out. However, in some cases, they may persist to retain your site preferences even after you’ve logged out.",
  },
  {
    title: "Login-Related Cookies",
    des: "We use cookies to recognize when you are logged in, so you don’t need to log in every time you visit a new page. These cookies are cleared when you log out to ensure secure access to restricted features and areas.",
  },
  {
    title: "Email and Newsletter Cookies",
    des: "If you subscribe to our newsletter or email services, cookies may be used to track your registration status and control which notifications are displayed, ensuring a customized experience for both subscribed and unsubscribed users.",
  },
  {
    title: "Order-Processing Cookies",
    des: "For our e-commerce or payment features, cookies are essential to remember your order details across pages, ensuring smooth and accurate order processing.",
  },
  {
    title: "Survey-Related Cookies",
    des: "We occasionally conduct surveys or questionnaires to provide valuable insights and understand our users better. Cookies may be used to identify users who have already participated or to maintain accurate results during page navigation.",
  },
  {
    title: "Form-Related Cookies",
    des: "When you submit information through forms, such as contact or comment forms, cookies may be set to remember your details for future interactions, saving you time on repeated submissions.",
  },
  {
    title: "Site Preferences Cookies",
    des: "To enhance your user experience, our website allows you to customize site preferences. Cookies are used to remember your settings, ensuring a seamless experience every time you revisit or interact with the site.",
  },
];

function CookiePolicy() {
  return (
    <section className="mx-auto max-w-7xl bg-white p-6 text-gray-900">
      <h1 className="mb-4 text-center text-3xl font-semibold">
        Cookies Policy
      </h1>
      <p className="mb-20 text-center">
        Below, you’ll find the Cookie Policy for our website, providing an
        overview of how cookies are used to enhance your experience on our
        platform.
      </p>

      <h2 className="text-xl font-semibold">
        What are Cookies and how do we use them?
      </h2>
      <p className="mt-4 mb-2.5">
        Cookies are small pieces of text stored in web browsers to save
        information about your interactions with websites. They are used to
        store and receive identifiers and other data on your computer, phone, or
        other devices. Additionally, other technologies, such as browser or
        device storage and unique device identifiers, serve similar purposes.
      </p>
      <p>
        On our platform, we use cookies to enhance your experience. Cookies help
        us deliver tailored services, improve website functionality, and
        understand how you interact with our tools. This policy explains the
        types of cookies we use, how they work, and the choices available to
        you.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        Understanding Cookies on Our Website
      </h2>
      <p className="mt-4 mb-2.5">
        We use cookies to enhance your experience and deliver essential features
        on our platform. These cookies help us provide functionality, improve
        performance, and offer tailored services.
      </p>
      <p>
        While you have the option to disable cookies, please note that there are
        no universal methods to do so without affecting the functionality and
        features they enable. If you are unsure about the necessity of certain
        cookies, we recommend keeping them enabled to ensure the best experience
        with our services.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        How can you manage Cookies?
      </h2>
      <p className="mt-4 mb-2.5">
        You have control over cookies through your browser settings, allowing
        you to prevent their storage or remove them at any time. Refer to your
        browser’s Help section for guidance on managing cookies.
      </p>
      <p>
        Please note, however, that disabling cookies may impact the
        functionality of this website and others you visit. Certain features and
        services rely on cookies to function properly, and turning them off may
        result in a less optimal browsing experience. For the best experience,
        we recommend keeping cookies enabled.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Types of Cookies We Use</h2>
      <ul className="ml-6 list-disc">
        <div className="mt-4 space-y-3">
          {cookiesType.map(({ title, des }, i) => (
            <li key={i}>
              <h4 className="mb-1.5 font-medium">{title}</h4>
              <p className="w-full max-w-3xl text-sm">{des}</p>
            </li>
          ))}
        </div>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Third Party Cookies</h2>
      <p className="my-4">
        In certain cases, we use cookies provided by trusted third parties to
        enhance your experience on our site. Below are the types of third-party
        cookies we employ:
      </p>

      <ul className="ml-5 list-disc">
        <li>
          <h4 className="mb-2 font-semibold">Analytics Cookies</h4>
          <p className="w-full max-w-3xl text-sm">
            We use Google Analytics, one of the most trusted analytics tools on
            the web, to understand how users interact with our site and identify
            areas for improvement. These cookies may track metrics like the time
            spent on the site, pages visited, and user behavior patterns. This
            data helps us create more engaging and optimized content. For
            additional details, visit the{" "}
            <Link
              href="https://marketingplatform.google.com/about/analytics/"
              className="text-primary"
            >
              Official Google Analytics page.
            </Link>
          </p>
        </li>
        <li>
          <h4 className="mt-4 mb-1.5 font-semibold">
            Social Media Integration Cookies
          </h4>
          <p className="w-full max-w-3xl text-sm">
            Our site includes social media buttons and/or plugins that let you
            connect to your social networks in various ways. To enable these
            features, social media platforms (such as Facebook, Twitter,
            LinkedIn, etc.) may set cookies through our site. These cookies can
            be used to enhance your profile on those platforms or contribute to
            their data collection as per their privacy policies.
          </p>
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Need More Information?</h2>
      <p className="mt-4 mb-2.5">
        If you need additional assistance, feel free to contact us at:
      </p>
      <p>
        <span className="font-medium">Email:</span>{" "}
        <a href="mailto:support@bobosohomail.com" className="text-primary">
          support@bobosohomail.com
        </a>
      </p>
    </section>
  );
}

export default CookiePolicy;
