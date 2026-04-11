import { Button } from '../atoms/Button';

const landmarks = [
  { id: 1, title: "Flint Cultural Center", tags: ["Local Artists", "Live Music"] },
  { id: 2, title: "Crossroads Village", tags: ["Fresh Produce", "Local Vendors"] },
  { id: 3, title: "Capitol Theatre", tags: ["Family Night", "Fridays at Sunset"] },
];

export const FeatureCards = ({ title }: { title: string }) => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-10">
      <h2 className="text-2xl font-bold text-cyan-600 mb-2">{title}</h2>
      <p className="text-gray-500 mb-10 text-sm">Your Town, Your Schedule</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {landmarks.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group transition-all hover:-translate-y-2">
            <div className="h-48 bg-gray-200 relative">
               {/* Image placeholder */}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-blue-900 text-lg mb-4">{item.title}</h3>
              <ul className="space-y-2 mb-6">
                {item.tags.map(tag => (
                   <li key={tag} className="text-sm text-gray-500 flex items-center gap-2">
                     <span className="w-1 h-1 bg-cyan-400 rounded-full"></span> {tag}
                   </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};