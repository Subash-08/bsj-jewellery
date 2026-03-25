import { shopifyFetch } from './fetch';

// ─── Types ────────────────────────────────────────────────
export type PolicyContent = {
  title: string;
  body: string;
} | null;

export type PolicyType =
  | 'privacyPolicy'
  | 'termsOfService'
  | 'refundPolicy'
  | 'shippingPolicy';

type AllPolicies = Record<PolicyType, PolicyContent>;

// ─── Hardcoded Content ────────────────────────────────────
const HARDCODED_POLICIES: Record<PolicyType, PolicyContent> = {
  privacyPolicy: {
    title: "Privacy Policy",
    body: `
      <p>Last updated: March 24, 2026</p>
      <p>BSJ Jewellers operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). BSJ Jewellers is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.</p>
      <p>Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy.</p>

      <h2>Personal Information We Collect or Process</h2>
      <p>When we use the term "personal information," we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified, so that it cannot identify or be reasonably linked to you. We may collect or process the following categories of personal information, including inferences drawn from this personal information, depending on how you interact with the Services, where you live, and as permitted or required by applicable law:</p>
      <ul>
        <li><strong>Contact details</strong> including your name, address, billing address, shipping address, phone number, and email address.</li>
        <li><strong>Financial information</strong> including credit card, debit card, and financial account numbers, payment card information, financial account information, transaction details, form of payment, payment confirmation and other payment details.</li>
        <li><strong>Account information</strong> including your username, password, security questions, preferences and settings.</li>
        <li><strong>Transaction information</strong> including the items you view, put in your cart, add to your wishlist, or purchase, return, exchange or cancel and your past transactions.</li>
        <li><strong>Communications with us</strong> including the information you include in communications with us, for example, when sending a customer support inquiry.</li>
        <li><strong>Device information</strong> including information about your device, browser, or network connection, your IP address, and other unique identifiers.</li>
        <li><strong>Usage information</strong> including information regarding your interaction with the Services, including how and when you interact with or navigate the Services.</li>
      </ul>

      <h2>Personal Information Sources</h2>
      <p>We may collect personal information from the following sources:</p>
      <ul>
        <li><strong>Directly from you</strong> including when you create an account, visit or use the Services, communicate with us, or otherwise provide us with your personal information;</li>
        <li><strong>Automatically through the Services</strong> including from your device when you use our products or services or visit our websites, and through the use of cookies and similar technologies;</li>
        <li><strong>From our service providers</strong> including when we engage them to enable certain technology and when they collect or process your personal information on our behalf;</li>
        <li><strong>From our partners</strong> or other third parties.</li>
      </ul>

      <h2>How We Use Your Personal Information</h2>
      <p>Depending on how you interact with us or which of the Services you use, we may use personal information for the following purposes:</p>
      <ul>
        <li><strong>Provide, Tailor, and Improve the Services.</strong> We use your personal information to provide you with the Services, including to perform our contract with you, to process your payments, to fulfill your orders, to remember your preferences and items you are interested in, to send notifications to you related to your account, to process purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, to facilitate any returns and exchanges, to enable you to post reviews, and to create a customized shopping experience for you, such as recommending products related to your purchases. This may include using your personal information to better tailor and improve the Services.</li>
        <li><strong>Marketing and Advertising.</strong> We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you online advertisements for products or services on the Services or other websites, including based on items you previously have purchased or added to your cart and other activity on the Services.</li>
        <li><strong>Security and Fraud Prevention.</strong> We use your personal information to authenticate your account, to provide a secure payment and shopping experience, detect, investigate or take action regarding possible fraudulent, illegal, unsafe, or malicious activity, protect public safety, and to secure our services. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password or other access details with anyone else.</li>
        <li><strong>Communicating with You.</strong> We use your personal information to provide you with customer support, to be responsive to you, to provide effective services to you and to maintain our business relationship with you.</li>
        <li><strong>Legal Reasons.</strong> We use your personal information to comply with applicable law or respond to valid legal process, including requests from law enforcement or government agencies, to investigate or participate in civil discovery, potential or actual litigation, or other adversarial legal proceedings, and to enforce or investigate potential violations of our terms or policies.</li>
      </ul>

      <h2>How We Disclose Personal Information</h2>
      <p>In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:</p>
      <ul>
        <li>With Shopify, vendors and other third parties who perform services on our behalf (e.g. IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).</li>
        <li>With business and marketing partners to provide marketing services and advertise to you. For example, we use Shopify to support personalized advertising with third-party services based on your online activity with different merchants and websites. Our business and marketing partners will use your information in accordance with their own privacy notices. Depending on where you reside, you may have a right to direct us not to share information about you to show you targeted advertisements and marketing based on your online activity with different merchants and websites.</li>
        <li>When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations.</li>
        <li>With our affiliates or otherwise within our corporate group.</li>
        <li>In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service or policies, and to protect or defend the Services, our rights, and the rights of our users or others.</li>
      </ul>

      <h2>Relationship with Shopify</h2>
      <p>The Services are hosted by Shopify, which collects and processes personal information about your access to and use of the Services in order to provide and improve the Services for you. Information you submit to the Services will be transmitted to and shared with Shopify as well as third parties that may be located in countries other than where you reside, in order to provide and improve the Services for you. In addition, to help protect, grow, and improve our business, we use certain Shopify enhanced features that incorporate data and information obtained from your interactions with our Store, along with other merchants and with Shopify. To provide these enhanced features, Shopify may make use of personal information collected about your interactions with our store, along with other merchants, and with Shopify. In these circumstances, Shopify is responsible for the processing of your personal information, including for responding to your requests to exercise your rights over use of your personal information for these purposes. To learn more about how Shopify uses your personal information and any rights you may have, you can visit the Shopify Consumer Privacy Policy. Depending on where you live, you may exercise certain rights with respect to your personal information here Shopify Privacy Portal Link.</p>
      
      <h2>Third Party Websites and Links</h2>
      <p>The Services may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites. Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services.</p>

      <h2>Children's Data</h2>
      <p>The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted. As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we "share" or "sell" (as those terms are defined in applicable law) personal information of individuals under 16 years of age.</p>

      <h2>Security and Retention of Your Information</h2>
      <p>Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.</p>
      <p>How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide you with Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.</p>

      <h2>Your Rights and Choices</h2>
      <p>Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.</p>
      <ul>
        <li><strong>Right to Access / Know:</strong> You may have a right to request access to personal information that we hold about you.</li>
        <li><strong>Right to Delete:</strong> You may have a right to request that we delete personal information we maintain about you.</li>
        <li><strong>Right to Correct:</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</li>
        <li><strong>Right of Portability:</strong> You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</li>
        <li><strong>Managing Communication Preferences:</strong> We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made.</li>
      </ul>
      <p>You may exercise any of these rights where indicated on the Services or by contacting us using the contact details provided below. To learn more about how Shopify uses your personal information and any rights you may have, including rights related to data processed by Shopify, you can visit https://privacy.shopify.com/en.</p>
      <p>We will not discriminate against you for exercising any of these rights. We may need to verify your identity before we can process your requests, as permitted or required under applicable law. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your rights. Before accepting such a request from an agent, we will require that the agent provide proof you have authorized them to act on your behalf, and we may need you to verify your identity directly with us. We will respond to your request in a timely manner as required under applicable law.</p>

      <h2>Complaints</h2>
      <p>If you have complaints about how we process your personal information, please contact us using the contact details provided below. Depending on where you live, you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority.</p>

      <h2>International Transfers</h2>
      <p>Please note that we may transfer, store and process your personal information outside the country you live in.</p>
      <p>If we transfer your personal information out of the European Economic Area or the United Kingdom, we will rely on recognized transfer mechanisms like the European Commission's Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.</p>

      <h2>Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this website, update the "Last updated" date and provide notice as required by applicable law.</p>

      <h2>Contact</h2>
      <p>Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us at bagyalakshmijewellers97@gmail.com or contact us at 57A/12, KOOLAKKADAI BAZAAR, TOWN, TOWN, Tirunelveli, TN, 627006, IN</p>
    `
  },
  refundPolicy: {
    title: "Return and Refund Policy",
    body: `
      <p>We have a 7 day return policy, which means you have 7 days after receiving your item to request a return.</p>
      <p>To be eligible for a return, your item must be in the damaged condition or wrong item that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.</p>
      <p>To start a return, you can contact us at bagyalakshmijewellers97@gmail.com. Please note that returns will need to be sent to the following address: [57A/12 ERKP Building Koolakadai Bazzar Tirunelveli Town 627006.</p>
      <p>If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>
      <p>You can always contact us for any return question at bagyalakshmijewellers97@gmail.com</p>

      <h2>Damages and issues</h2>
      <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>

      <h2>Exceptions / non-returnable items</h2>
      <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
      <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>

      <h2>Exchanges</h2>
      <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>

      <h2>European Union 14 day cooling off period</h2>
      <p>Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.</p>

      <h2>Refunds</h2>
      <p>We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
      <p>If more than 15 business days have passed since we've approved your return, please contact us at bagyalakshmijewellers97@gmail.com</p>
    `
  },
  termsOfService: {
    title: "Terms of Service",
    body: `
      <h2>OVERVIEW</h2>
      <p>Welcome to BSJ Jewellers! The terms "we", "us" and "our" refer to BSJ Jewellers. BSJ Jewellers operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the "Services"). BSJ Jewellers is powered by Shopify, which enables us to provide the Services to you.</p>
      <p>The below terms and conditions, together with any policies referenced herein (these "Terms of Service" or "Terms") describe your rights and responsibilities when you use the Services.</p>
      <p>Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.</p>
      <p>By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.</p>

      <h2>SECTION 1 - ACCESS AND ACCOUNT</h2>
      <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage.</p>
      <p>To use the Services, including accessing or browsing our online stores or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide in our stores is correct, current and complete and that you have all rights necessary to provide this information.</p>
      <p>You are solely responsible for maintaining the security of your account credentials and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person.</p>

      <h2>SECTION 2 - OUR PRODUCTS</h2>
      <p>We have made every effort to provide an accurate representation of our products and services in our online stores. However, please note that colors or product appearance may differ from how they may appear on your screen due to the type of device you use to access the store and your device settings and configuration.</p>
      <p>We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be the same as depicted or rendered in our online stores.</p>
      <p>All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.</p>

      <h2>SECTION 3 - ORDERS</h2>
      <p>When you place an order, you are making an offer to purchase. BSJ Jewellers reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until BSJ Jewellers confirms acceptance. We must receive and process your payment before your order is accepted. Please review your order carefully before submitting, as BSJ Jewellers may be unable to accommodate cancellation requests after an order is accepted. In the event that we do not accept, make a change to, or cancel an order, we will attempt to notify you by contacting the e-mail, billing address, and/or phone number provided at the time the order was made.</p>
      <p>Your purchases are subject to return or exchange solely in accordance with our Refund Policy.</p>
      <p>You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export.</p>

      <h2>SECTION 4 - PRICES AND BILLING</h2>
      <p>Prices, discounts and promotions are subject to change without notice. The price charged for a product or service will be the price in effect at the time the order is placed and will be set out in your order confirmation email. Unless otherwise expressly stated, posted prices do not include taxes, shipping, handling, customs or import charges.</p>
      <p>Prices posted in our online stores may be different from prices offered in physical stores or in online or other stores operated by third parties. We may offer, from time to time, promotions on the Services that may affect pricing and that are governed by terms and conditions separate from these Terms. If there is a conflict between the terms for a promotion and these Terms, the promotion terms will govern.</p>
      <p>You agree to provide current, complete and accurate purchase, payment and account information for all purchases made at our stores. You agree to promptly update your account and other information, including your email address, credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p>
      <p>You represent and warrant that (i) the credit card information you provide is true, correct, and complete, (ii) you are duly authorized to use such credit card for the purchase, (iii) charges incurred by you will be honored by your credit card company, and (iv) you will pay charges incurred by you at the posted prices, including shipping and handling charges and all applicable taxes, if any.</p>

      <h2>SECTION 5 - SHIPPING AND DELIVERY</h2>
      <p>We are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control. Once we transfer products to the carrier, title and risk of loss passes to you.</p>

      <h2>SECTION 6 - INTELLECTUAL PROPERTY</h2>
      <p>Our Services, including but not limited to all trademarks, brands, text, displays, images, graphics, product reviews, video, and audio, and the design, selection, and arrangement thereof, are owned by BSJ Jewellers, its affiliates or licensors and are protected by U.S. and foreign patent, copyright and other intellectual property laws.</p>
      <p>These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Services without our prior written consent. Except as expressly provided herein, nothing in these Terms grants or shall be construed as granting a license or other rights to you under any patent, trademark, copyright, or other intellectual property of BSJ Jewellers, Shopify or any third party. Unauthorized use of the Services may be a violation of federal and state intellectual property laws. All rights not expressly granted herein are reserved by BSJ Jewellers.</p>
      <p>BSJ Jewellers's names, logos, product and service names, designs, and slogans are trademarks of BSJ Jewellers or its affiliates or licensors. You must not use such trademarks without the prior written permission of BSJ Jewellers. Shopify's name, logo, product and service names, designs and slogans are trademarks of Shopify. All other names, logos, product and service names, designs, and slogans on the Services are the trademarks of their respective owners.</p>

      <h2>SECTION 7 - OPTIONAL TOOLS</h2>
      <p>You may be provided with access to customer tools offered by third parties as part of the Services, which we neither monitor nor have any control nor input.</p>
      <p>You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
      <p>Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p>
      <p>We may also, in the future, offer new features through the Services (including the release of new tools and resources). Such new features shall also be deemed part of the Services and are subject to these Terms of Service.</p>

      <h2>SECTION 8 - THIRD-PARTY LINKS</h2>
      <p>The Services may contain materials and hyperlinks to websites provided or operated by third parties (including any embedded third party functionality). We are not responsible for examining or evaluating the content or accuracy of any third-party materials or websites you choose to access. If you decide to leave the Services to access these materials or third party sites, you do so at your own risk.</p>
      <p>We are not liable for any harm or damages related to your access of any third-party websites, or your purchase or use of any products, services, resources, or content on any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products and services should be directed to the third-party.</p>

      <h2>SECTION 9 - RELATIONSHIP WITH SHOPIFY</h2>
      <p>BSJ Jewellers is powered by Shopify, which enables us to provide the Services to you. However, any sales and purchases you make in our Store are made directly with BSJ Jewellers. By using the Services, you acknowledge and agree that Shopify is not responsible for any aspect of any sales between you and BSJ Jewellers, including any injury, damage, or loss resulting from purchased products and services. You hereby expressly release Shopify and its affiliates from all claims, damages, and liabilities arising from or related to your purchases and transactions with BSJ Jewellers.</p>

      <h2>SECTION 10 - PRIVACY POLICY</h2>
      <p>All personal information we collect through the Services is subject to our Privacy Policy. By using the Services, you acknowledge that you have read these privacy policies.</p>
      <p>Because the Services are hosted by Shopify, Shopify collects and processes personal information about your access to and use of the Services in order to provide and improve the Services for you. Information you submit to the Services will be transmitted to and shared with Shopify as well as third parties that may be located in other countries than where you reside, in order to provide services to you. Review our privacy policy for more details on how we, Shopify, and our partners use your personal information.</p>

      <h2>SECTION 11 - FEEDBACK</h2>
      <p>If you submit, upload, post, email, or otherwise transmit any ideas, suggestions, feedback, reviews, proposals, plans, or other content (collectively, "Feedback"), you grant us a perpetual, worldwide, sublicensable, royalty-free license to use, reproduce, modify, publish, distribute and display such Feedback in any medium for any purpose, including for commercial use. We may, for example, use our rights under this license to operate, provide, evaluate, enhance, improve and promote the Services and to perform our obligations and exercise our rights under the Terms of Service.</p>
      <p>You also represent and warrant that: (i) you own or have all necessary rights to all Feedback; (ii) you have disclosed any compensation or incentives received in connection with your submission of Feedback; and (iii) your Feedback will comply with these Terms. We are and shall be under no obligation (1) to maintain your Feedback in confidence; (2) to pay compensation for your Feedback; or (3) to respond to your Feedback.</p>
      <p>We may, but have no obligation to, monitor, edit or remove Feedback that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</p>
      <p>You agree that your Feedback will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your Feedback will not contain libelous or otherwise unlawful, abusive or obscene Feedback, or contain any computer virus or other malware that could in any way affect the operation of the Services or any related website. You may not use a false email address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any Feedback. You are solely responsible for any Feedback you make and its accuracy. We take no responsibility and assume no liability for any Feedback posted by you or any third-party.</p>

      <h2>SECTION 12 - ERRORS, INACCURACIES AND OMISSIONS</h2>
      <p>Occasionally there may be information on or in the Services that contain typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate at any time without prior notice (including after you have submitted your order).</p>

      <h2>SECTION 13 - PROHIBITED USES</h2>
      <p>You may access and use the Services for lawful purposes only. You may not access or use the Services, directly or indirectly: (a) for any unlawful or malicious purpose; (b) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (c) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (d) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or harm any of our employees or any other person; (e) to transmit false or misleading information; (f) to send, knowingly receive, upload, download, use, or re-use any material that does not comply with the these Terms; (g) to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation; (h) to impersonate or attempt to impersonate any other person or entity; or (i) to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm BSJ Jewellers, Shopify or users of the Services, or expose them to liability.</p>
      <p>In addition, you agree not to: (a) upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Services; (b) reproduce, duplicate, copy, sell, resell or exploit any portion of the Services; (c) collect or track the personal information of others; (d) spam, phish, pharm, pretext, spider, crawl, or scrape; or (e) interfere with or circumvent the security features of the Services or any related website, other websites, or the Internet. We reserve the right to suspend, disable, or terminate your account at any time, without notice, if we determine that you have violated any part of these Terms.</p>

      <h2>SECTION 14 - TERMINATION</h2>
      <p>We may terminate this agreement or your access to the Services (or any part thereof) in our sole discretion at any time without notice, and you will remain liable for all amounts due up to and including the date of termination.</p>
      <p>The following sections will continue to apply following any termination: Intellectual Property, Feedback, Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Severability, Waiver; Entire Agreement, Assignment, Governing Law, Privacy Policy, and any other provisions that by their nature should survive termination.</p>

      <h2>SECTION 15 - DISCLAIMER OF WARRANTIES</h2>
      <p>The information presented on or through the Services is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Services, or by anyone who may be informed of any of its contents.</p>
      <p>EXCEPT AS EXPRESSLY STATED BY BSJ Jewellers, THE SERVICES AND ALL PRODUCTS OFFERED THROUGH THE SERVICES ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' FOR YOUR USE, WITHOUT ANY REPRESENTATION, WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, TITLE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE, REPRESENT OR WARRANT THAT YOUR USE OF THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER WARRANTIES SO THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU.</p>

      <h2>SECTION 16 - LIMITATION OF LIABILITY</h2>
      <p>TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO CASE SHALL BSJ Jewellers, OUR PARTNERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, SERVICE PROVIDERS OR LICENSORS, OR THOSE OF SHOPIFY AND ITS AFFILIATES, BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, LOST PROFITS, LOST REVENUE, LOST SAVINGS, LOSS OF DATA, REPLACEMENT COSTS, OR ANY SIMILAR DAMAGES, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, ARISING FROM YOUR USE OF ANY OF THE SERVICES OR ANY PRODUCTS PROCURED USING THE SERVICES, OR FOR ANY OTHER CLAIM RELATED IN ANY WAY TO YOUR USE OF THE SERVICES OR ANY PRODUCT, INCLUDING, BUT NOT LIMITED TO, ANY ERRORS OR OMISSIONS IN ANY CONTENT, OR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SERVICES OR ANY CONTENT (OR PRODUCT) POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, EVEN IF ADVISED OF THEIR POSSIBILITY.</p>

      <h2>SECTION 17 - INDEMNIFICATION</h2>
      <p>You agree to indemnify, defend and hold harmless BSJ Jewellers, Shopify, and our affiliates, partners, officers, directors, employees, agents, contractors, licensors, and service providers from any losses, damages, liabilities or claims, including reasonable attorneys' fees, payable to any third party due to or arising out of (1) your breach of these Terms of Service or the documents they incorporate by reference, (2) your violation of any law or the rights of a third party, or (3) your access to and use of the Services.</p>

      <h2>SECTION 18 - SEVERABILITY</h2>
      <p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>

      <h2>SECTION 19 - WAIVER; ENTIRE AGREEMENT</h2>
      <p>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
      <p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Service constitutes the entire agreement and understanding between you and us and governs your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p>

      <h2>SECTION 20 - ASSIGNMENT</h2>
      <p>You may not delegate, transfer or assign this Agreement or any of your rights or obligations under these Terms without our prior written consent, and any such attempt will be null and void. We may transfer, assign, or delegate these Terms and our rights and obligations without consent or notice to you.</p>

      <h2>SECTION 21 - GOVERNING LAW</h2>
      <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the federal and state or territorial courts in the jurisdiction where BSJ Jewellers is headquartered. You and BSJ Jewellers consent to venue and personal jurisdiction in such courts.</p>

      <h2>SECTION 22 - HEADINGS</h2>
      <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>

      <h2>SECTION 23 - CHANGES TO TERMS OF SERVICE</h2>
      <p>You can review the most current version of the Terms of Service at any time on this page.</p>
      <p>We reserve the right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. We will notify you of any material changes to these Terms in accordance with applicable law, and such changes will be effective on the date specified in the notice. Your continued use of or access to the Services following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>

      <h2>SECTION 24 - CONTACT INFORMATION</h2>
      <p>Questions about the Terms of Service should be sent to us at bagyalakhsmijewellers97@gmail.com</p>
      <p>Our contact information is posted below:<br/>
      Trade name: BSJ Jewellers<br/>
      Phone number: 9790790527<br/>
      Email: bagyalakhsmijewellers97@gmail.com<br/>
      Physical address: BAGYALAKSHMI JEWELLERY, 57A/12, KOOLAKKADAI BAZAAR, TOWN, TOWN, 627006 Tirunelveli TN, India</p>
    `
  },
  shippingPolicy: {
    title: "Shipping Policy",
    body: `
      <p>Thank you for shopping at BSJ Jewellers. We are committed to delivering your favorite silver and gold jewelry safely and on time. Below are the terms and conditions that constitute our Shipping Policy.</p>

      <h2>1. Shipment Processing Time</h2>
      <ul>
        <li>All orders are processed within 48 business hours.</li>
        <li>Orders are not shipped or delivered on weekends or public holidays.</li>
        <li>If we are experiencing a high volume of orders (such as during festive seasons), shipments may be delayed by a few days. Please allow additional days in transit for delivery.</li>
      </ul>

      <h2>2. Shipping Rates &amp; Delivery Estimates</h2>
      <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
      <table>
        <thead>
          <tr>
            <th>Shipping Method</th>
            <th>Estimated Delivery Time</th>
            <th>Shipping Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Shipping (India)</td>
            <td>5-7 Business Days</td>
            <td>₹70</td>
          </tr>
          <tr>
            <td>Express Shipping (India)</td>
            <td>2-3 Business Days</td>
            <td>₹150</td>
          </tr>
          <tr>
            <td>International Shipping</td>
            <td>10-15 Days</td>
            <td>Calculated at Checkout</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Note:</strong> Delivery delays can occasionally occur due to unforeseen logistics issues or weather conditions.</p>

      <h2>3. Shipment Confirmation &amp; Order Tracking</h2>
      <p>Once your order has shipped, you will receive a Shipment Confirmation email containing your tracking number(s). The tracking number will be active within 24 hours. You can track your package via our courier partner's website.</p>

      <h2>4. Transit Insurance</h2>
      <p>BSJ Jewellers ensures all parcels are fully insured until they reach your doorstep. We take full responsibility for the safety of the jewelry during transit. However, we are not responsible for any damage caused after the delivery has been successfully completed.</p>

      <h2>5. Custom Duties &amp; Taxes (International Orders)</h2>
      <p>BSJ Jewellers is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>

      <h2>6. Damaged or Tampered Parcels</h2>
      <p>If you receive a parcel that appears to be tampered with or damaged, please do not accept the delivery.</p>
      <p>We strongly recommend recording an unboxing video as proof to help us process any claims for missing or damaged items during transit.</p>
      <p>Report any issues to our customer support within 24 hours of delivery at bagyalakshmijewellers97@gmail.com.</p>

      <h2>7. Incorrect Shipping Addresses</h2>
      <p>BSJ Jewellers will not be held responsible for orders shipped to an incorrect address provided by the customer. Please ensure your shipping details are accurate before finalizing your order.</p>
    `
  }
};

// ─── GraphQL Queries ──────────────────────────────────────
const SHOP_POLICIES_QUERY = /* GraphQL */ `
  query shopPolicies {
    shop {
      privacyPolicy {
        title
        body
      }
      termsOfService {
        title
        body
      }
      refundPolicy {
        title
        body
      }
    }
  }
`;

const PAGE_BY_HANDLE_QUERY = /* GraphQL */ `
  query pageByHandle($handle: String!) {
    page(handle: $handle) {
      title
      body
    }
  }
`;

// ─── Handle-to-policy mapping for fallback ────────────────
const POLICY_HANDLE_MAP: Record<PolicyType, string> = {
  privacyPolicy: 'privacy-policy',
  termsOfService: 'terms-of-service',
  refundPolicy: 'refund-policy',
  shippingPolicy: 'shipping-policy',
};

// ─── Helpers ──────────────────────────────────────────────
type ShopPoliciesResponse = {
  shop: {
    privacyPolicy: { title: string; body: string } | null;
    termsOfService: { title: string; body: string } | null;
    refundPolicy: { title: string; body: string } | null;
  };
};

type PageResponse = {
  page: { title: string; body: string } | null;
};

function isValidPolicy(
  p: { title: string; body: string } | null | undefined
): p is { title: string; body: string } {
  return !!p && typeof p.title === 'string' && typeof p.body === 'string' && p.body.trim().length > 0;
}

/**
 * Fetches a single Shopify page by handle.
 * Returns null on any error — never throws.
 */
async function fetchPageFallback(handle: string): Promise<PolicyContent> {
  try {
    const response = await shopifyFetch<PageResponse>({
      query: PAGE_BY_HANDLE_QUERY,
      variables: { handle },
      cache: 'force-cache',
    });

    const page = response.body?.page;
    return isValidPolicy(page) ? { title: page.title, body: page.body } : null;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────

/**
 * Fetch all four policies.
 *
 * 1. Primary: Tries to resolve from HARDCODED_POLICIES first.
 * 2. Fallback: Fetches from shop { privacyPolicy, termsOfService, refundPolicy }
 * 3. Fallback: Fetches from page(handle: ...) if still missing
 * 4. Never throws — returns null for any policy that cannot be resolved.
 */
export async function getAllPolicies(): Promise<AllPolicies> {
  let shopData: ShopPoliciesResponse['shop'] | null = null;

  try {
    const response = await shopifyFetch<ShopPoliciesResponse>({
      query: SHOP_POLICIES_QUERY,
      cache: 'force-cache',
    });
    shopData = response.body?.shop ?? null;
  } catch {
    // Will fall back to page queries below
  }

  // Resolve each policy: prefer HARDCODED -> then shop-level data -> then page query
  const resolve = async (type: PolicyType): Promise<PolicyContent> => {
    // 1. Primary fallback: hardcoded policies
    if (HARDCODED_POLICIES[type]) {
      return HARDCODED_POLICIES[type];
    }

    // 2. Secondary fallback: Shopify API shop object
    // shippingPolicy is NEVER on the shop object
    if (type !== 'shippingPolicy' && shopData) {
      const shopPolicy = shopData[type as keyof typeof shopData];
      if (isValidPolicy(shopPolicy)) {
        return { title: shopPolicy.title, body: shopPolicy.body };
      }
    }

    // 3. Final fallback: fetch by page handle
    return fetchPageFallback(POLICY_HANDLE_MAP[type]);
  };

  const [privacyPolicy, termsOfService, refundPolicy, shippingPolicy] =
    await Promise.all([
      resolve('privacyPolicy'),
      resolve('termsOfService'),
      resolve('refundPolicy'),
      resolve('shippingPolicy'),
    ]);

  return { privacyPolicy, termsOfService, refundPolicy, shippingPolicy };
}

/**
 * Fetch a single policy by type.
 * Convenience wrapper around getAllPolicies().
 */
export async function getPolicy(type: PolicyType): Promise<PolicyContent> {
  const all = await getAllPolicies();
  return all[type];
}