import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { Hotel } from '../shared/model/Hotel';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './hotel-management.component.html',
  styleUrls: ['./hotel-management.component.scss']
})
export class HotelManagementComponent implements OnInit {
  router: any;
  selectedFile: File | null = null;
  dragOver: boolean = false;
  displayedColumns: string[] = ['name', 'street', 'number', 'city', 'rating', 'amenities', 'actions'];
  dataSource = new MatTableDataSource<Hotel>([]);
  isNameTaken: boolean = false;
  editingHotel: Hotel | null = null;
  expandedHotelId: string | null = null;

  newHotel: Omit<Hotel, '_id'> = {
    name: '',
    city: '',
    street: '',
    number: '',
    description: '',
    amenities: [],
    rating: 0,
    photos: ''
  };

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        console.log('Loaded hotels:', hotels);
        this.dataSource.data = hotels;
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      }
    });
  }

  addAmenity(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.newHotel.amenities = this.newHotel.amenities || [];
      this.newHotel.amenities.push(value);
    }
    event.chipInput!.clear();
  }

  removeAmenity(amenity: string): void {
    const index = this.newHotel.amenities?.indexOf(amenity) ?? -1;
    if (index >= 0) {
      this.newHotel.amenities?.splice(index, 1);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    if (file.type.match(/image\/*/) === null) {
      console.error('Only images are supported');
      return;
    }

    this.newHotel.photos = file.name;
    this.selectedFile = file;
    console.log('Selected file:', file.name);
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      if (file.type.match(/image\/*/) === null) {
        console.error('Only images are supported');
        return;
      }

      this.newHotel.photos = file.name;
      console.log('Selected file:', file.name);
    }
  }

  checkHotelName(name: string) {
    if (!name) return;

    const existingHotel = this.dataSource.data.find(
      hotel => hotel.name.toLowerCase() === name.toLowerCase()
    );

    this.isNameTaken = !!existingHotel;
  }

  addHotel(): void {
    if (!this.newHotel.name || !this.newHotel.city || !this.newHotel.street || !this.newHotel.number || this.isNameTaken) {
      console.error('Required fields missing');
      return;
    }

    const hotelData = {
      name: this.newHotel.name,
      city: this.newHotel.city,
      street: this.newHotel.street,
      number: this.newHotel.number,
      description: this.newHotel.description || '',
      amenities: this.newHotel.amenities || [],
      rating: this.newHotel.rating || 0,
      photos: this.newHotel.photos || ''  // Empty string as default
    };

    this.hotelService.createHotel(hotelData).subscribe({
      next: (hotel) => {
        console.log('Hotel created:', hotel);
        this.loadHotels();
        this.resetForm();
        this.selectedFile = null;
      },
      error: (error) => {
        console.error('Error creating hotel:', error);
      }
    });
  }

  private resetForm(): void {
    this.newHotel = {
      name: '',
      city: '',
      street: '',
      number: '',
      description: '',
      amenities: [],
      rating: 0,
      photos: ''
    };
  }

  viewDetails(hotelId: string | undefined): void {
    if (hotelId) {
      this.router.navigate(['/hotels', hotelId]);
    }
  }

  bookHotel(hotelId: string | undefined): void {
    if (hotelId) {
      this.router.navigate(['/booking', hotelId]);
    }
  }

  deleteHotel(hotelId: string): void {
    if (!hotelId) {
      console.error('No hotel ID provided');
      return;
    }

    // Confirm deletion with the user
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(hotelId).subscribe({
        next: () => {
          console.log('Hotel deleted successfully');
          // Refresh the hotel list
          this.loadHotels();
        },
        error: (error) => {
          console.error('Error deleting hotel:', error);
        }
      });
    }
  }


  editHotel(hotel: Hotel): void {
    this.editingHotel = {
      ...hotel,
      amenities: [...(hotel.amenities || [])]
    };
    this.expandedHotelId = hotel._id ?? null;
  }

  cancelEdit(): void {
    this.editingHotel = null;
    this.expandedHotelId = null;
  }
  saveHotelChanges(): void {
    if (!this.editingHotel?._id) {
      console.error('No hotel to update');
      return;
    }

    this.hotelService.updateHotel(this.editingHotel._id, this.editingHotel).subscribe({
      next: (updatedHotel) => {
        console.log('Hotel updated:', updatedHotel);
        this.loadHotels();
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Error updating hotel:', error);
      }
    });
  }

  addAmenityToEdit(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.editingHotel) {
      this.editingHotel.amenities = this.editingHotel.amenities || [];
      this.editingHotel.amenities.push(value);
    }
    event.chipInput!.clear();
  }

  removeAmenityFromEdit(amenity: string): void {
    if (!this.editingHotel?.amenities) return;

    const index = this.editingHotel.amenities.indexOf(amenity);
    if (index >= 0) {
      this.editingHotel.amenities.splice(index, 1);
    }
  }

  handleEditFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && this.editingHotel) {
      if (file.type.match(/image\/*/) === null) {
        console.error('Only images are supported');
        return;
      }

      this.editingHotel.photos = file.name;
      console.log('Selected file for edit:', file.name);
    }
  }

}
