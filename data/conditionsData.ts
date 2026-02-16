export interface ConditionTopic {
  id: string;
  title: string;
  details: string;
}

export interface ConditionSection {
  id: string;
  title: string;
  percentage?: string;
  topics: ConditionTopic[];
}

export const conditionsData: ConditionSection[] = [
  {
    id: "cardio",
    title: "Core Cardiovascular Disorders",
    percentage: "10-15%",
    topics: [
      {
        id: "acs",
        title: "Acute Coronary Syndromes (STEMI, NSTEMI, Unstable Angina)",
        details: `**Presentation:**
*   **Classic:** Substernal, crushing chest pain radiating to the arm or jaw.
*   **Atypical (common in women, older adults, diabetics):** Dyspnea, epigastric pain, fatigue.
*   **EKG Findings:** ST-segment elevations (STE) >2 mm in contiguous leads, new left bundle branch block (LBBB), or ST-segment depressions.
*   **Cardiac Enzymes:**
    *   **Troponins:** Rise in 3-5 hours, remain elevated for 7-10 days (sensitive and specific).
    *   **CK-MB:** Rises in 4-8 hours, normalizes by 72 hours (useful for detecting reinfarction).

**Diagnosis & Management:**
*   **Initial Management (MONA-BASH):** Morphine, Oxygen (if SpO₂ <90%), Nitrates, Aspirin, Beta-blocker, ACE inhibitor, Statin, and Heparin.
*   **STEMI Reperfusion:**
    *   **PCI (preferred):** Door-to-balloon time goal of 90 minutes.
    *   **Thrombolysis (alternative):** If PCI is unavailable within 2 hours. Contraindicated with history of intracranial hemorrhage, recent ischemic stroke (within 6 months), or recent surgery.
*   **Discharge Medications:** Dual antiplatelet therapy (aspirin + P2Y12 inhibitor), high-intensity statin, beta-blocker, and ACE inhibitor.`
      },
      {
        id: "chf",
        title: "Congestive Heart Failure (CHF)",
        details: `**Presentation:**
*   **Systolic Dysfunction:** Reduced ejection fraction (<40%).
*   **Diastolic Dysfunction:** Preserved ejection fraction (>50%).
*   **Acute Decompensation Symptoms:** Orthopnea, paroxysmal nocturnal dyspnea (PND), jugular venous distention (JVD), bibasilar crackles, pitting lower extremity edema.
*   **Chest X-ray (CXR) Findings:** Cardiomegaly, cephalization of pulmonary vessels, Kerley B lines, interstitial edema.

**Diagnosis & Management:**
*   **Diagnostic Markers:** Brain natriuretic peptide (BNP).
*   **Best Test:** Echocardiography to assess ejection fraction.
*   **Acute Pulmonary Edema Management (LMNOP):** Lasix (furosemide), Morphine, Nitrates, Oxygen, Position (upright).
*   **Long-Term Mortality Reducing Therapies:** ACE inhibitors/ARBs, specific beta-blockers (metoprolol, carvedilol, bisoprolol), and spironolactone.
*   **Symptom Control Only:** Digoxin and furosemide.`
      },
      {
        id: "vhd",
        title: "Valvular Heart Disease",
        details: `**Presentation & Murmurs:**
*   **Aortic Stenosis (AS):** Systolic ejection murmur radiates to carotids; decreases with Valsalva.
*   **Hypertrophic Obstructive Cardiomyopathy (HOCM):** Murmur increases with Valsalva.
*   **Mitral Regurgitation (MR):** Holosystolic murmur radiates to the axilla.
*   **Mitral Valve Prolapse (MVP):** Late systolic click and murmur.

**Management Principles:**
*   Recognize when intervention is warranted (e.g., valve replacement for symptomatic, severe AS).
*   Medical management strategies (e.g., rate control for mitral stenosis with atrial fibrillation).`
      },
      {
        id: "arrhythmias",
        title: "Arrhythmias",
        details: `**Presentation:**
*   **Atrial Fibrillation (most common):** "Irregularly irregular" rhythm, absent P waves. Assess stroke risk with CHA₂DS₂-VASc score.
*   **Supraventricular Tachycardia (SVT):** Regular, narrow-complex tachycardia.
*   **Atrioventricular (AV) Blocks:** Distinguished by PR interval patterns.

**Management:**
*   **Atrial Fibrillation:** Rate control, rhythm control, and anticoagulation.
*   **Acute SVT:** Vagal maneuvers, then adenosine.
*   **Third-Degree (Complete) Heart Block:** Often requires pacemaker placement.`
      },
      {
        id: "pericardial",
        title: "Pericardial Disease",
        details: `**Presentation:**
*   **Acute Pericarditis:** Sharp, pleuritic chest pain relieved by sitting up and leaning forward. May have pericardial friction rub. EKG shows diffuse, concave ST-segment elevations and PR depressions.
*   **Cardiac Tamponade:** A medical emergency. Characterized by Beck's triad (hypotension, JVD, distant heart sounds), pulsus paradoxus (>10 mmHg drop in systolic BP with inspiration), and electrical alternans on EKG.

**Management:**
*   **Acute Pericarditis:** First-line treatment is NSAIDs and colchicine.
*   **Cardiac Tamponade:** Requires urgent pericardiocentesis.`
      },
      {
        id: "vascular",
        title: "Vascular Emergencies (Aortic Dissection)",
        details: `**Presentation:**
*   Sudden-onset, "tearing" chest pain radiating to the back.
*   Significant blood pressure differential between arms.
*   Widened mediastinum on CXR.

**Management:**
*   Immediate aggressive heart rate and blood pressure control (IV beta-blockers), followed by urgent surgical consultation.`
      },
      {
        id: "endocarditis",
        title: "Infective Endocarditis",
        details: `**Presentation:**
*   **Classic signs:** Fever, new/changing heart murmur.
*   **Peripheral stigmata:** Janeway lesions (painless), Osler nodes (painful), Roth spots (retinal hemorrhages).
*   **Risk Factors:** IV drug use (IVDU) classically affects the tricuspid valve with Staphylococcus aureus. Prosthetic valves.

**Diagnosis & Management:**
*   **Diagnosis:** Use Duke criteria.
*   **First Step:** Obtain multiple blood cultures before administering antibiotics.
*   **Empiric Treatment:** Vancomycin to cover MRSA.
*   **Prophylaxis:** Indicated for high-risk patients undergoing certain dental or respiratory procedures.`
      }
    ]
  },
  {
    id: "respiratory",
    title: "Core Respiratory System Disorders",
    percentage: "10-15%",
    topics: [
      {
        id: "copd",
        title: "Obstructive Lung Diseases: COPD",
        details: `**Diagnosis:** PFTs show a decreased FEV₁/FVC ratio (<0.7).

**Acute Exacerbation Management:**
*   Oxygen (target SpO₂ 88-92%).
*   Bronchodilators (albuterol/ipratropium).
*   Systemic corticosteroids.
*   Antibiotics (if increased sputum purulence/volume).

**Mortality Improving Interventions:**
*   Smoking cessation.
*   Long-term home oxygen therapy for severe hypoxemia (PaO₂ <55 mmHg or SpO₂ <88%).`
      },
      {
        id: "asthma",
        title: "Obstructive Lung Diseases: Asthma",
        details: `**Management:**
*   Step-up approach, starting with SABA and adding inhaled corticosteroids (ICS).

**Recognizing Impending Respiratory Failure:**
*   A tiring patient with a normalizing or rising PCO₂ on ABG requires immediate intubation.`
      },
      {
        id: "pneumonia",
        title: "Pneumonia",
        details: `**Presentation & Associations:**
*   **Typical CAP:** Streptococcus pneumoniae (rust-colored sputum).
*   **Atypical Pneumonia:** Mycoplasma pneumoniae (young adults), Legionella (GI symptoms, hyponatremia).
*   **Alcoholics:** Klebsiella (currant jelly sputum).
*   **Post-influenza:** Staphylococcus aureus.

**Diagnosis & Management:**
*   **First Step:** CXR.
*   **Hospitalization Assessment:** CURB-65 score (Confusion, Urea >7, Respiratory rate ≥30, BP <90/60, age ≥65).
*   **Empiric Antibiotics:** Macrolides or doxycycline (outpatient); ceftriaxone plus a macrolide (inpatient).`
      },
      {
        id: "pe",
        title: "Pulmonary Embolism (PE)",
        details: `**Presentation:**
*   **Classic Triad:** Pleuritic chest pain, dyspnea, hemoptysis.
*   **Most Common Signs:** Tachycardia and tachypnea.
*   **Risk Factors:** Virchow's triad (stasis, hypercoagulability, endothelial injury).

**Diagnosis & Management:**
*   **Algorithm:** Assess pre-test probability (Wells' score).
*   **Low-risk:** Negative D-dimer can rule out PE.
*   **High-risk:** CT pulmonary angiography is the test of choice.
*   **Immediate Management:** Start anticoagulation (heparin or DOAC) as soon as PE is suspected.`
      },
      {
        id: "pleural_effusions",
        title: "Pleural Effusions",
        details: `**Diagnosis:**
*   **Key Step:** Differentiate transudate vs. exudate via thoracentesis using Light's criteria.
*   **Exudative Criteria:** Pleural:serum protein >0.5, OR pleural:serum LDH >0.6, OR pleural LDH >2/3 upper limit of normal serum LDH.
*   **Causes of Transudates:** Systemic conditions (CHF, cirrhosis, nephrotic syndrome).
*   **Causes of Exudates:** Local processes (pneumonia, malignancy, PE).

**Management:**
*   Primary step is diagnostic thoracentesis.
*   Complicated parapneumonic effusion or empyema (pH <7.2 or glucose <60 mg/dL) requires chest tube drainage.`
      },
      {
        id: "ild",
        title: "Interstitial Lung Disease (ILD)",
        details: `**Presentation & PFTs:** Restrictive pattern (normal/increased FEV₁/FVC ratio, decreased TLC).

**Classic Presentations:**
*   **Sarcoidosis:** Bilateral hilar lymphadenopathy, erythema nodosum, uveitis, hypercalcemia. Biopsy shows non-caseating granulomas.
*   **Asbestosis:** Pleural plaques, lower lobe fibrosis.
*   **Silicosis:** Upper lobe nodules, "eggshell" calcification of hilar nodes.`
      },
      {
        id: "lung_cancer",
        title: "Lung Cancer",
        details: `**Presentation & Paraneoplastic Syndromes:**
*   **Squamous Cell Carcinoma:** Central; associated with hypercalcemia (PTHrP).
*   **Small Cell Carcinoma:** Central; associated with SIADH, Cushing's (ectopic ACTH), Lambert-Eaton syndrome.
*   **Adenocarcinoma:** Peripheral; most common in non-smokers and women.`
      },
      {
        id: "ards",
        title: "Acute Respiratory Distress Syndrome (ARDS)",
        details: `**Presentation & Diagnosis:**
*   Acute, severe hypoxemia and bilateral pulmonary infiltrates on CXR (non-cardiogenic).
*   **Diagnostic Criteria:** PaO₂/FiO₂ ratio <300 and PCWP <18 mmHg.
*   **Common Causes:** Sepsis, pancreatitis, trauma, aspiration.

**Management:**
*   Mechanical ventilation with a lung-protective strategy (low tidal volumes).`
      }
    ]
  },
  {
    id: "gi",
    title: "Core Nutritional and Digestive Disorders",
    percentage: "10-15%",
    topics: [
      {
        id: "gi_bleed",
        title: "Upper and Lower GI Bleeding",
        details: `**Presentation:**
*   **Upper GI Bleed:** Hematemesis (bright red or "coffee-ground") or melena (black, tarry stools).
*   **Lower GI Bleed:** Hematochezia (bright red blood per rectum).

**Management:**
*   **Immediate Priority:** Resuscitation (ABCs) with two large-bore IVs, fluids, and blood products.
*   Start an IV proton pump inhibitor (PPI) for suspected upper GI bleeds.
*   **Endoscopy (EGD/Colonoscopy):** For diagnosis and therapy.`
      },
      {
        id: "ibd",
        title: "Inflammatory Bowel Disease (IBD)",
        details: `**Crohn's Disease:**
*   **Location:** Any part of GI tract ("gum to bum"), commonly terminal ileum. "Skip lesions."
*   **Inflammation:** Transmural, leading to fistulas, abscesses, strictures.

**Ulcerative Colitis (UC):**
*   **Location:** Limited to the colon, always involves the rectum, extends proximally and continuously.
*   **Inflammation:** Mucosal only. Bloody diarrhea is a hallmark.

**Key Associations:**
*   Primary sclerosing cholangitis (PSC) is strongly associated with UC.
*   Extraintestinal manifestations (arthritis, uveitis) can occur with both.

**Management:**
*   **Mild:** 5-ASA agents (mesalamine).
*   **Acute Flares:** Corticosteroids.
*   **Moderate-Severe:** Immunomodulators (azathioprine) or biologics (infliximab).`
      },
      {
        id: "pancreatitis",
        title: "Pancreatitis",
        details: `**Presentation & Diagnosis:**
*   Severe epigastric pain radiating to the back. Serum lipase >3x upper limit of normal is diagnostic.
*   **Common Causes:** Gallstones and alcohol.

**Management:**
*   Supportive care (NPO, aggressive IV fluids, pain control).

**Complications:**
*   Pseudocyst, abscess, ARDS.`
      },
      {
        id: "liver",
        title: "Liver Disease",
        details: `**Hepatitis:**
*   **Hepatitis B Serologies:** HBsAg (active infection), anti-HBs (immunity), anti-HBc (present in infection, not vaccination), IgM anti-HBc (acute infection).
*   **Liver Enzymes:** AST:ALT ratio >2 suggests alcoholic hepatitis. ALT/AST in the thousands suggests viral/ischemic hepatitis.

**Cirrhosis:**
*   **Focus:** Recognizing and managing complications of decompensation.
*   **Hepatic Encephalopathy:** In a cirrhotic with altered mental status, find the trigger (infection, GI bleed, dehydration).
*   **Spontaneous Bacterial Peritonitis (SBP):** In a cirrhotic with fever/abdominal pain, perform diagnostic paracentesis (ascitic fluid neutrophil count >250 cells/mm³).
*   **Other Complications:** Esophageal varices, ascites (use SAAG), hepatorenal syndrome.`
      },
      {
        id: "biliary",
        title: "Biliary Tract Disease",
        details: `**Presentations:**
*   **Cholelithiasis:** Gallstones; may cause biliary colic.
*   **Cholecystitis:** Gallbladder inflammation; constant RUQ pain, fever, positive Murphy's sign.
*   **Choledocholithiasis:** Stone in common bile duct; obstructive jaundice.
*   **Ascending Cholangitis:** Biliary tree infection; Charcot's triad (fever, jaundice, RUQ pain) or Reynolds' pentad (+ hypotension, altered mental status).

**Diagnosis & Management:**
*   **Initial Test:** Ultrasound.
*   **Equivocal Cholecystitis:** HIDA scan.
*   **Choledocholithiasis/Cholangitis:** ERCP is diagnostic and therapeutic.`
      },
      {
        id: "diarrhea",
        title: "Diarrhea",
        details: `**Workup:**
*   Differentiate acute (<2 weeks) vs. chronic; inflammatory vs. non-inflammatory.

**Infectious Causes:**
*   **Clostridioides difficile:** Post-antibiotic use; diagnosed with stool toxin assay.
*   **Traveler's Diarrhea:** ETEC.
*   **Rapid-onset Food Poisoning:** Staphylococcus aureus, Bacillus cereus.
*   **Bloody Diarrhea:** E. coli O157:H7, Shigella, Salmonella, Campylobacter.`
      }
    ]
  },
  {
    id: "endocrine",
    title: "Core Endocrine and Metabolic Disorders",
    percentage: "8-12%",
    topics: [
      {
        id: "diabetes",
        title: "Diabetes Mellitus",
        details: `**Acute Hyperglycemic Crises:**
*   **DKA (Type 1):** Hyperglycemia, anion gap metabolic acidosis, positive ketones.
*   **HHS (Type 2):** Profound hyperglycemia and hyperosmolality, no significant ketoacidosis.
*   **Management:** Aggressive IV fluids, insulin infusion, careful potassium monitoring and repletion.

**Outpatient Management:**
*   HbA1c targets, mechanisms of oral hypoglycemic agents.`
      },
      {
        id: "thyroid",
        title: "Thyroid Disorders",
        details: `**Hyperthyroidism:**
*   **Graves' Disease:** Diffusely high uptake on RAIU scan.
*   **Thyroiditis:** Decreased uptake on RAIU scan.
*   **Thyroid Storm:** Manage with beta-blockers, PTU, and iodine.

**Hypothyroidism:**
*   **Most Common Cause:** Hashimoto's thyroiditis (anti-TPO antibodies).

**Thyroid Nodule Workup:**
*   Initial TSH, then ultrasound, then fine-needle aspiration for "cold" nodules.`
      },
      {
        id: "adrenal",
        title: "Adrenal Disorders",
        details: `**Adrenal Insufficiency (Addison's Disease):**
*   **Presentation:** Hypotension, weakness, hyperpigmentation, hyponatremia, hyperkalemia.
*   **Diagnosis:** Cosyntropin stimulation test.
*   **Adrenal Crisis:** Treat with IV fluids and hydrocortisone.

**Cushing's Syndrome (Cortisol Excess):**
*   **Screening:** 24-hour urine free cortisol or low-dose dexamethasone suppression test.`
      },
      {
        id: "calcium",
        title: "Calcium/Parathyroid",
        details: `**Hypercalcemia Workup:** Measure PTH levels.
*   **Elevated PTH:** Suggests primary hyperparathyroidism.
*   **Suppressed PTH:** Suggests malignancy or other causes.`
      },
      {
        id: "adh",
        title: "ADH Disorders",
        details: `**SIADH:** Euvolemic hyponatremia with inappropriately concentrated urine.
**Diabetes Insipidus (DI):** Hypernatremia with inappropriately dilute urine.`
      }
    ]
  },
  {
    id: "renal",
    title: "Core Renal and Genitourinary Disorders",
    percentage: "5-10%",
    topics: [
      {
        id: "aki",
        title: "Acute Kidney Injury (AKI)",
        details: `**Pre-renal Azotemia:** From hypoperfusion. BUN:Cr >20, FENa <1%.
**Intrinsic AKI:**
*   **ATN (most common):** From ischemia/nephrotoxins. "Muddy brown casts."
*   **AIN:** Allergic reaction (NSAIDs, penicillins). Fever, rash, urine eosinophils.

**Post-renal AKI:** Obstruction (BPH, stones). Diagnose with renal ultrasound.`
      },
      {
        id: "ckd",
        title: "Chronic Kidney Disease (CKD)",
        details: `**Focus:** Managing long-term complications (anemia, mineral/bone disease, hyperkalemia).
**Indications for Urgent Dialysis (AEIOU):** Acidosis, Electrolytes, Intoxication, Overload, Uremia.`
      },
      {
        id: "gn",
        title: "Glomerulonephritis",
        details: `**Nephritic Syndrome:** Hematuria, RBC casts, hypertension, mild proteinuria (e.g., Post-strep GN, IgA nephropathy).
**Nephrotic Syndrome:** Heavy proteinuria (>3.5 g/day), hypoalbuminemia, edema, hyperlipidemia (e.g., minimal change disease, FSGS).`
      },
      {
        id: "electrolytes",
        title: "Electrolyte Disturbances",
        details: `**Hyponatremia:** First step is assessing volume status (hypovolemic, euvolemic, hypervolemic).
**Hyperkalemia:** Recognize EKG changes (peaked T waves, widened QRS). Acute management: calcium gluconate, then insulin/glucose and beta-agonists.`
      },
      {
        id: "acidbase",
        title: "Acid-Base Disorders",
        details: `**Interpretation Steps:**
1.  Check pH.
2.  Check PCO₂ and HCO₃⁻ to find primary disorder.
3.  Calculate anion gap if metabolic acidosis.
4.  Assess for compensation.`
      },
      {
        id: "nephrolithiasis",
        title: "Nephrolithiasis",
        details: `**Presentation:** Acute flank pain radiating to the groin, hematuria.
**Management:** Stones <5 mm likely to pass with hydration/pain control. Larger stones may need intervention.`
      }
    ]
  },
  {
    id: "heme",
    title: "Core Hematology and Oncology",
    percentage: "5-10%",
    topics: [
      {
        id: "anemia",
        title: "Anemias",
        details: `**Microcytic (MCV < 80):** Iron deficiency (low ferritin, high TIBC), thalassemia.
**Macrocytic (MCV > 100):** Vitamin B12 deficiency (neurological symptoms), folate deficiency.
**Normocytic (MCV 80-100):** Anemia of chronic disease, hemolysis (high LDH, high indirect bilirubin, low haptoglobin).`
      },
      {
        id: "coagulation",
        title: "Coagulation Disorders",
        details: `**Platelet Disorders (e.g., ITP):** Mucocutaneous bleeding, prolonged bleeding time.
**Coagulation Factor Disorders (e.g., Hemophilia):** Deep tissue bleeding (hemarthrosis), prolonged PTT or PT.
**MAHA (Microangiopathic Hemolytic Anemias):**
*   **TTP/HUS:** Thrombocytopenia, schistocytes, normal coagulation studies.
*   **DIC:** MAHA with prolonged PT/PTT due to consumption of clotting factors.`
      },
      {
        id: "malignancies",
        title: "Hematologic Malignancies",
        details: `**Acute Leukemias:** Pancytopenia, >20% blasts in bone marrow. Auer rods are pathognomonic for AML.
**Chronic Leukemias:**
*   **CML:** Philadelphia chromosome (t[9;22]).
*   **CLL:** Incidental marked lymphocytosis in an older adult.

**Lymphoma:** Painless lymphadenopathy. "B symptoms" (fever, night sweats, weight loss). Reed-Sternberg cells are characteristic of Hodgkin's lymphoma.
**Multiple Myeloma:** CRAB criteria (hyperCalcemia, Renal failure, Anemia, Bone lesions).`
      },
      {
        id: "onc_emergencies",
        title: "Oncologic Emergencies",
        details: `**Neutropenic Fever:** Immediate broad-spectrum antibiotics.
**Tumor Lysis Syndrome:** Hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia.
**Hypercalcemia of Malignancy.**`
      }
    ]
  },
  {
    id: "ancillary",
    title: "High-Yield Topics in Ancillary Systems",
    percentage: "1-5% each",
    topics: [
      {
        id: "neurology",
        title: "Neurology",
        details: `**Ischemic Stroke:** Know signs and the time window for tPA (<4.5 hours from onset).
**Status Epilepticus:** Manage with benzodiazepines first, then fosphenytoin.
**Meningitis CSF:**
*   **Bacterial:** High neutrophils, low glucose, high protein.
*   **Viral:** High lymphocytes, normal glucose.`
      },
      {
        id: "rheumatology",
        title: "Rheumatology",
        details: `**Arthritis Differentiation:**
*   **Inflammatory (e.g., RA):** Morning stiffness, symmetric small joint involvement.
*   **Non-inflammatory (e.g., OA):** Pain worse with use.

**Acute Monoarthritis:** Must perform joint aspiration.
*   **Septic Arthritis:** WBC >50,000.
*   **Gout:** Negatively birefringent, needle-shaped crystals.
*   **Pseudogout:** Positively birefringent, rhomboid-shaped crystals.

**Vasculitis:** Giant cell arteritis (headache, jaw claudication, vision loss in an older adult).`
      },
      {
        id: "id",
        title: "Infectious Disease",
        details: `**Sepsis/Septic Shock:** Recognition (SIRS/qSOFA) and initial management (IV fluids, broad-spectrum antibiotics, source control).
**HIV:** Know opportunistic infections and prophylaxis guidelines by CD4 count (e.g., PCP prophylaxis with TMP-SMX at CD4 <200).`
      },
      {
        id: "dermatology",
        title: "Dermatology",
        details: `**Skin Findings of Systemic Disease:**
*   **Erythema nodosum** (sarcoidosis, IBD).
*   **Heliotrope rash and Gottron's papules** (dermatomyositis).
*   **Malar rash** (SLE).`
      }
    ]
  },
  {
    id: "preventive",
    title: "Principles of Health Maintenance and Preventive Medicine",
    topics: [
      {
        id: "outpatient",
        title: "Outpatient Management Cornerstones",
        details: `**Hypertension:**
*   **First-line Agents:** ACE inhibitors/ARBs (preferred in diabetes/CKD), thiazide diuretics, calcium channel blockers.
*   **Side Effects:** ACE inhibitor cough, CCB peripheral edema.

**Hyperlipidemia:**
*   **Goal:** LDL reduction.
*   **First-line Therapy:** Statins (intensity based on 10-year ASCVD risk score).

**Diabetes Mellitus:**
*   **Goal:** HbA1c target typically <7%.
*   **First-line Agent:** Metformin.`
      },
      {
        id: "screening",
        title: "Cancer Screening (Average-Risk Adults)",
        details: `**Breast Cancer:** Mammography, starts at age 40-50, every 1-2 years.
**Cervical Cancer:** Pap test with HPV co-testing, starts at age 25, every 3-5 years.
**Colorectal Cancer:** Colonoscopy starting at age 45 every 10 years, OR annual FIT test.
**Lung Cancer:** Low-dose CT scan for high-risk individuals (age 50-80 with ≥20 pack-year history, current smoker or quit within 15 years), annually.`
      },
      {
        id: "immunizations",
        title: "Adult Immunizations",
        details: `**Influenza:** Annually for all adults.
**Tdap/Td:** Tdap once, then Td booster every 10 years.
**Pneumococcal:** All adults ≥65; younger adults with chronic conditions.
**Zoster (Shingrix):** All adults ≥50 years.
**HPV:** Recommended through age 26.`
      }
    ]
  }
];
