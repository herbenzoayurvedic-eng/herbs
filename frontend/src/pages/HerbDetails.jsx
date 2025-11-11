import React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const defaultAuthor = {
  name: "Author Name",
  designation: "Herbal Researcher",
  avatarUrl: "",
};

function normalizeHerb(herb) {
  {console.log(herb);}
  if (!herb) return null;
  // Ensure expected fields exist to avoid conditional checks later
  return {
    Herb_Name: herb.Herb_Name || herb.name || "",
    Common_Names: herb.Common_Names || herb.commonNames || [],
    Scientific_Name: herb.Scientific_Name || herb.scientificName || "",
    Introduction: herb.Introduction || herb.introduction || "",
    Background_and_Traditional_Use: herb.Background_and_Traditional_Use || herb.background || "",
    Active_Constituents: herb.Active_Constituents || herb.constituents || "",
    Mechanism_of_Action: herb.Mechanism_of_Action || herb.mechanism || "",
    Health_Benefits: herb.Health_Benefits || herb.healthBenefits || [],
    Safety_and_Side_Effects: herb.Safety_and_Side_Effects || herb.safety || "",
    Toxicity: herb.Toxicity || herb.toxicity || "",
    Warnings_and_Contraindications: herb.Warnings_and_Contraindications || herb.warnings || "",
    Drug_Interactions: herb.Drug_Interactions || herb.drugInteractions || "",
    Seasonal_Usage: herb.Seasonal_usage || herb.seasonal_usage || herb.Seasonal_Usage || "",
    Recommended_Dosage: herb.Recommended_Dosage || herb.dosage || "",
    References: herb.References || herb.references || "",
    slug: herb.slug || herb.id || "",
    author: herb.author || null,
    Active_Pharmaceutical_Ingredient: herb.Active_Pharmaceutical_Ingredient || null,
    imageUrl: herb.imageUrl || herb['Image-url'] || herb.Image_URL || ""
  };
}

function useHerbData(propsHerb) {
  const { slug } = useParams();
  const [state, setState] = useState({ herb: normalizeHerb(propsHerb), loading: !propsHerb && !!slug, error: null });

  useEffect(() => {
    let isMounted = true;
    async function fetchHerb() {
      if (!slug || propsHerb) return;
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(`http://localhost:5000/api/herbs/slug/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`Failed to load herb: ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        if (data.success) {
          console.log(data.data);
          setState({ herb: normalizeHerb(data.data), loading: false, error: null });
         
        } else {
          setState({ herb: null, loading: false, error: data.message || "Error loading herb" });
        }
      } catch (err) {
        if (!isMounted) return;
        setState({ herb: null, loading: false, error: err.message || "Error loading herb" });
      }
    }
    fetchHerb();
    return () => {
      isMounted = false;
    };
  }, [slug, propsHerb]);

  return state;
}

function SectionTitle({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-xl md:text-2xl font-semibold text-gray-900">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/70 backdrop-blur-md border border-white/50 shadow-lg rounded-xl ${className}`}>
      {children}
    </div>
  );
}

function Avatar({ url, name }) {
  const initials = useMemo(() => {
    const parts = String(name || "").trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "?";
  }, [name]);
  return (
    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name || "Author"} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function TableOfContents({ sections, onJump, activeSection }) {
  return (
    <nav className="px-6 py-6">
      <div className="text-xl uppercase tracking-wide text-black-500 mb-6">Contents</div>
      <ul className="space-y-4 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onJump(s.id)}
              className={`text-left w-full text-md transition-colors duration-200 rounded group focus:outline-none px-2 py-1 ${activeSection === s.id
                ? "text-green-800 bg-green-100 font-medium"
                : "text-gray-700 hover:text-green-800 hover:bg-green-100"
                }`}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HealthBenefitItem({ benefit }) {
  return (
    <li >
      <div className="h-full w-full bg-brown-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-1xl bg-opacity-10 border-gray-100 px-4 py-4" style={{  borderImageSource: 'linear-gradient(156.57deg, #190B28 -5.56%, #575757 28.26%, #373030 98.31%)', borderImageSlice: 1, boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.25)' }}>
        <div className=" items-start justify-between gap-3">
          <div className="font-semibold text-gray-900 text-base">{benefit.Benefit_Name}</div>
          {benefit.Evidence_Rating ? (
            <span className="shrink-0 inline-flex items-center rounded-full text-amber-950 text-xs font-medium  py-0.5">
              {benefit.Evidence_Rating}
            </span>
          ) : null}
        </div>
        {benefit.Evidence_Summary ? (
          <p className="text-sm text-gray-700 mt-3 leading-6">{benefit.Evidence_Summary}</p>
        ) : null}
      </div>
    </li>
  );
}

const HerbDetails = ({ herb: propsHerb }) => {
  const { herb, loading, error } = useHerbData(propsHerb);
  const [activeSection, setActiveSection] = useState("");

  const sections = useMemo(() => {
    if (!herb) return [];
    const list = [
      { id: "introduction", title: "Introduction", content: herb.Introduction },
      { id: "background", title: "Background & Traditional Use", content: herb.Background_and_Traditional_Use },
      { id: "constituents", title: "Active Constituents", content: herb.Active_Constituents },
      { id: "mechanism", title: "Mechanism of Action", content: herb.Mechanism_of_Action },
      { id: "benefits", title: "Health Benefits", content: herb.Health_Benefits },
      { id: "safety", title: "Safety & Side Effects", content: herb.Safety_and_Side_Effects },
      { id: "toxicity", title: "Toxicity", content: herb.Toxicity },
      { id: "warnings", title: "Warnings & Contraindications", content: herb.Warnings_and_Contraindications },
      { id: "interactions", title: "Drug Interactions", content: herb.Drug_Interactions },
      { id: "usage", title: "Seasonal Usage", content: herb.Seasonal_Usage },
      { id: "dosage", title: "Recommended Dosage", content: herb.Recommended_Dosage },
      { id: "api", title: "Active Pharmaceutical Ingredient", content: herb.Active_Pharmaceutical_Ingredient },
      { id: "references", title: "References", content: herb.References },
    ];
    return list.filter((s) => (
      Array.isArray(s.content)
        ? s.content.length > 0
        : s && s.content && typeof s.content === "object"
          ? Object.keys(s.content || {}).length > 0
          : !!s.content
    ));
  }, [herb]);

  const onJump = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveSection(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (!sections.length) return;

    const observers = [];
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    };

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sections]);

  console.log(herb);

  return (

    
    <div className="min-h-screen bg-white">
  
      {/* Hero section with herb image */}
      <section className="relative h-56 md:h-72 w-full flex items-center justify-center overflow-hidden">
        <img
          src={herb?.imageUrl}
          alt={herb?.Herb_Name}
          className="absolute inset-0 w-full h-full object-cover object-center "
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0" style={{ zIndex: 1 }} />
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        {/* Heading & meta */}
        <div className="mb-6">
          {loading ? (
            <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
          ) : error ? (
            <h1 className="text-2xl font-semibold text-red-700">{error}</h1>
          ) : (
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-amber-950">{herb?.Herb_Name}</h1>
              <div className="mt-2 text-sm text-amber-950">
                {herb?.Scientific_Name && <span className="italic">{herb.Scientific_Name}</span>}
                {herb?.Common_Names?.length ? (
                  <span className="ml-2">· Common: {herb.Common_Names.join(", ")}</span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6 md:gap-8">
          {/* Left column: sticky container for contents and author */}
          <div className="space-y-6 md:space-y-6">
            <div className="sticky top-4 flex flex-col gap-6">
              {/* Contents card */}
              <Card>
                <TableOfContents sections={sections} onJump={onJump} activeSection={activeSection} />
              </Card>
              {/* Author card */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar url={herb?.author?.avatarUrl || defaultAuthor.avatarUrl} name={herb?.author?.name || defaultAuthor.name} />
                  <div>
                    <div className="text-gray-900 font-medium">{herb?.author?.name || defaultAuthor.name}</div>
                    <div className="text-gray-600 text-sm">{herb?.author?.designation || defaultAuthor.designation}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right column: content */}
          <div className="space-y-8">
            {loading && (
              <Card className="p-6">
                <div className="h-5 w-1/3 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </Card>
            )}

            {!loading && sections.map((section) => (
              <Card key={section.id} className="p-6">
                <SectionTitle id={section.id}>{section.title}</SectionTitle>
                {/* Content types */}
                {Array.isArray(section.content) ? (
                  section.id === "benefits" ? (
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      {section.content.map((benefit, idx) => (
                        <HealthBenefitItem key={idx} benefit={benefit} />
                      ))}
                    </ul>
                  ) : section.id === "references" ? (
                    <ol className="mt-4 space-y-3 list-decimal list-inside text-gray-800">
                      {section.content.map((ref, idx) => {
                        const text = String(ref).trim();
                        const isUrl = /^https?:\/\//i.test(text);
                        return (
                          <li key={idx} className="leading-7 break-words">
                            {isUrl ? (
                              <a href={text} target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline">
                                {text}
                              </a>
                            ) : (
                              text
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <ul className="mt-4 list-disc list-inside text-gray-800">
                      {section.content.map((item, idx) => (
                        <li key={idx}>{String(item)}</li>
                      ))}
                    </ul>
                  )
                ) : (
                  typeof section.content === "object" && section.content !== null ? (
                    section.id === "api" ? (
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              ["Name", section.content.Name],
                              ["Chemical Formula", section.content.Chemical_Formula],
                              ["IUPAC Name", section.content.IUPAC_Name],
                              ["Molecular Weight", section.content.Molecular_Weight],
                              ["Chemical Classification", section.content.Chemical_Classification],
                            ].map(([label, value]) => (
                              value ? (
                                <div key={label} className="p-4 bg-white/60 rounded-lg border border-white/50">
                                  <dt className="text-sm font-medium text-gray-600">{label}</dt>
                                  <dd className="mt-1 text-gray-900 text-sm break-words">{String(value)}</dd>
                                </div>
                              ) : null
                            ))}
                          </dl>
                        </div>
                        {section.content.Molecular_Structure_Image ? (
                          <div className="flex items-start justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={section.content.Molecular_Structure_Image}
                              alt={section.content.Name || "Molecular Structure"}
                              className="max-h-64 object-contain rounded-lg border border-white/50 bg-white/60 p-2"
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(section.content).map(([key, value]) => (
                            <div key={key} className="p-4 bg-white/60 rounded-lg border border-white/50">
                              <dt className="text-sm font-medium text-gray-600">{key.replace(/_/g, " ")}</dt>
                              <dd className="mt-1 text-gray-900 text-sm">
                                {typeof value === "string" || typeof value === "number"
                                  ? String(value)
                                  : Array.isArray(value)
                                    ? value.join(", ")
                                    : value && typeof value === "object"
                                      ? JSON.stringify(value)
                                      : "-"}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )
                  ) : (
                    section.id === "references" ? (
                      (() => {
                        const items = String(section.content)
                          .split(/\r?\n+/)
                          .map(s => s.trim())
                          .filter(Boolean);
                        return (
                          <ol className="mt-4 space-y-6 list-decimal list-inside text-gray-800">
                            {items.map((ref, idx) => {
                              const isUrl = /^https?:\/\//i.test(ref);
                              return (
                                <li key={idx} className="leading-8 break-words">
                                  {isUrl ? (
                                    <a href={ref} target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline">
                                      {ref}
                                    </a>
                                  ) : (
                                    ref
                                  )}
                                </li>
                              );
                            })}
                          </ol>
                        );
                      })()
                    ) : (
                      <p className="mt-4 leading-7 text-gray-800 whitespace-pre-line">{section.content}</p>
                    )
                  )
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HerbDetails;

