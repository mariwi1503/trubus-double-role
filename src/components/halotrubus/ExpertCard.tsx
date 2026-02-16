
import React from 'react';
import { Star, MessageCircle, Clock } from 'lucide-react';
import { Expert, formatPrice } from '@/data/dummyData';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ExpertCardProps {
  expert: Expert;
  onConsultClick: (expert: Expert) => void;
  variant?: 'default' | 'compact';
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onConsultClick, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Card
        onClick={() => onConsultClick(expert)}
        className="cursor-pointer hover:shadow-md transition-all min-w-[160px] border-border/50"
      >
        <CardContent className="p-3 flex flex-col items-center">
          <div className="relative mb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={expert.image} alt={expert.name} />
              <AvatarFallback>{expert.name[0]}</AvatarFallback>
            </Avatar>
            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${expert.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
          </div>
          <h3 className="text-sm font-semibold text-center line-clamp-1">{expert.name}</h3>
          <p className="text-xs text-muted-foreground text-center line-clamp-1">{expert.specialization}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-muted-foreground">{expert.rating}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all border-border/50">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={expert.image} alt={expert.name} />
              <AvatarFallback>{expert.name[0]}</AvatarFallback>
            </Avatar>
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${expert.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{expert.name}</h3>
            <p className="text-sm text-primary font-medium">{expert.specialization}</p>
            <p className="text-xs text-muted-foreground mt-1">{expert.experience} tahun pengalaman</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-muted-foreground">{expert.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{expert.consultations}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Mulai dari</p>
          <p className="text-primary font-bold">{formatPrice(expert.price)}</p>
        </div>
        <Button
          onClick={() => onConsultClick(expert)}
          disabled={!expert.isOnline}
          variant={expert.isOnline ? "default" : "secondary"}
          size="sm"
          className="rounded-full px-6"
        >
          {expert.isOnline ? 'Konsultasi' : 'Offline'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
