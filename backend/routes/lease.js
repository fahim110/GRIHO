const express = require('express');
const router = express.Router();

// @route   POST /api/lease/generate
// @desc    Generate structured Bangladesh House Rental Agreement (ভাড়া চুক্তিপত্র)
router.post('/generate', (req, res) => {
  const {
    landlordName,
    landlordNID,
    landlordPhone,
    tenantName,
    tenantNID,
    tenantPhone,
    propertyAddress,
    propertyArea,
    monthlyRent,
    serviceCharge,
    advanceDeposit,
    leaseTermMonths = 12,
    commencementDate,
    gasType = 'Titas Line Gas',
    electricityType = 'Prepaid Meter',
  } = req.body;

  const agreementText = `
================================================================================
                    গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
               বাড়ি ও ফ্ল্যাট ভাড়া চুক্তিপত্র (House Rental Agreement)
================================================================================

প্রথম পক্ষ (মালিক / Landlord):
নাম: ${landlordName || '...........................................'}
জাতীয় পরিচয়পত্র (NID): ${landlordNID || '...........................................'}
ফোন নম্বর: ${landlordPhone || '...........................................'}

দ্বিতীয় পক্ষ (ভাড়াটিয়া / Tenant):
নাম: ${tenantName || '...........................................'}
জাতীয় পরিচয়পত্র (NID): ${tenantNID || '...........................................'}
ফোন নম্বর: ${tenantPhone || '...........................................'}

ভাড়াকৃত ফ্ল্যাট / বাড়ির বিবরণ:
ঠিকানা: ${propertyAddress || '...........................................'}, ${propertyArea || 'Dhaka'}

চুক্তির শর্তাবলী (Terms & Conditions):
১. চুক্তির মেয়াদ: এই চুক্তিটি আগামী ${commencementDate || '...................'} তারিখ হইতে মোট ${leaseTermMonths} মাসের জন্য বলবৎ থাকিবে।
২. মাসিক ভাড়া: প্রতি মাসের মূল ভাড়া বাবদ ৳${monthlyRent ? Number(monthlyRent).toLocaleString('en-IN') : '..................'} (টাকা) নির্ধারিত হইল, যাহা পরবর্তী মাসের ১০ তারিখের মধ্যে পরিশোধ করিতে হইবে।
৩. সার্ভিস চার্জ: প্রতি মাসে ভবনের সার্ভিস চার্জ বাবদ ৳${serviceCharge ? Number(serviceCharge).toLocaleString('en-IN') : '0'} টাকা প্রদেয় হইবে।
৪. অগ্রিম / জামানত (Security Deposit): দ্বিতীয় পক্ষ প্রথম পক্ষকে জামানত বাবদ মোট ৳${advanceDeposit ? Number(advanceDeposit).toLocaleString('en-IN') : '..................'} টাকা প্রদান করিলেন, যাহা চুক্তি সমাপ্তির পর সমন্বয়যোগ্য বা ফেরতযোগ্য হইবে।
৫. গ্যাস ও বিদ্যুৎ বিল: গ্যাস সংযোগ (${gasType}) এবং বিদ্যুৎ বিল (${electricityType}) চুক্তি অনুযায়ী নিয়মিত পরিশোধিত হইবে।
৬. নোটিশ পিরিয়ড: কোনো পক্ষ চুক্তি বাতিল বা বাসা ত্যাগ করিতে চাহিলে কমপক্ষে ২ (দুই) মাস পূর্বে লিখিত নোটিশ প্রদান করিতে হইবে।
৭. অননুমোদিত ব্যবহার নিষিদ্ধ: ভাড়াকৃত স্থান শুধুমাত্র আবাসিক উদ্দেশ্যে ব্যবহৃত হইবে।

প্রথম পক্ষের স্বাক্ষর (Landlord):               দ্বিতীয় পক্ষের স্বাক্ষর (Tenant):

___________________________                     ___________________________
তারিখ:                                           তারিখ:

সাক্ষীগণের স্বাক্ষর (Witnesses):
১. ________________________                     ২. ________________________
================================================================================
`;

  res.json({
    success: true,
    data: {
      agreementText,
      generatedAt: new Date().toISOString(),
    },
  });
});

module.exports = router;
