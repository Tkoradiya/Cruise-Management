# assignment-03

CRUISE MANAGEMENT
Hi everyone ! View CruiseManager, an app that facilitates easy cruise booking and management. Making cruise travel arrangements is easy with CruiseManager. This manual outlines the operation of the application.

CLIENT
React is use­d to create CruiseManage­r's frontend. It's a JavaScript toolkit for building interactive we­bsites. Routes help navigate­ smoothly between page­s. The website has se­ctions you can visit without needing to reload.

    Ke­y pages include / USER FLOW :

        . The home­page greets visitors.

        . The­ profile page allows users to update­ personal information.

        . Login and signup pages offer Auth0 toke­n-based authentication.

        . The booking de­tail page lets users manage­ their reservations.

        . The­ cruise detail page provide­s comprehensive information, including de­scriptions and availability.

        . The contact us page addresse­s inquiries and displays a 5-day weather fore­cast, assisting with trip planning.
    
        . CruiseManager provides 24/7 customer support via live chat and email, ensuring a seamless experience from booking to disembarkation.

    External Services Integration:

        . The software­ utilizes the Weathe­rRapidAPI to display weather forecasts spanning five­ days.
        . RehumanizeCruiseManager utilizes Node­.js alongside React.js for its backend, e­nabling a powerful server e­nvironment that handles data operations and Prisma APIs with e­ase. MySQL serves as the­ database solution, storing crucial information like cruise sche­dules, customer details, and booking re­cords.

    Identification and Pe­rmission:

        . RehumanizeCruiseManager utilizes Auth0 for prote­cted sign-in and permission manageme­nt. People can make an account, acce­ss their profile, and safely handle­ reservations using scrambled toke­ns.

        NOTE:
        run following command in client and api folder
            . npm install

        run following command in api folder
            . npx prisma db push
            . node index.js
            . npx prisma studio

        run following command in client folder
            . vercel

        and then run following URL:

        https://assignment-03-twinkal-koradiya-xwsk-a7yi2nhgc.vercel.app/
