import { EscortProfileService } from '../../escort-profile/escort-profile.service';
import { ListServiceDTO } from '../dto/list.dto';

declare global {
  interface Array<T> {
    setEscortProfile(escortProfileService: EscortProfileService): Promise<ListServiceDTO[]>;
  }
}

Array.prototype.setEscortProfile = async function (escortProfileService: EscortProfileService): Promise<ListServiceDTO[]> {
  const listServiceDTO = [];

  for (const service of this) {
    const escortProfile = await escortProfileService.findOne({
      where: { escortId: service.escortId.toString() },
    });
    const innerListServiceDTO = new ListServiceDTO();

    innerListServiceDTO._id = service._id;
    innerListServiceDTO.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
    innerListServiceDTO.cost = (service.price + service.businessCommission);
    innerListServiceDTO.status = service.status;
    innerListServiceDTO.customerId = service.customerId;
    innerListServiceDTO.escortId = service.escortId;
    innerListServiceDTO.createdAt = service.createdAt;
    innerListServiceDTO.updatedAt = service.updatedAt;

    listServiceDTO.push(innerListServiceDTO);
  }

  return listServiceDTO;
};
